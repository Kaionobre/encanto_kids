from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.pacote.models import Pacote
from apps.responsavel.models import Responsavel
from apps.crianca.models import Crianca
from apps.contrato.models import Contrato
from datetime import date, timedelta

class ContratoURLsTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.client = APIClient()
        self.url = reverse('contrato-list')

        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.pacote = Pacote.objects.create(
            nome='Pacote Integral',
            descricao='Turno integral com atividades completas',
            tipo='integral',
            status='ativo'
        )

        self.responsavel = Responsavel.objects.create(
            user=self.user,
            nome='Kaio Nóbrega',
            cpf='123.456.789-00',
            email='kaio@email.com',
            telefone='(83)99999-9999'
        )

        self.crianca = Crianca.objects.create(
            nome='Lara',
            idade=5,
            turno='integral',
            tipo_de_pacote=self.pacote,
            status=True,
            responsavel=self.responsavel
        )

    def test_contrato_url_esta_correta(self):
        url_esperada = '/api/contrato/'  
        self.assertEqual(self.url, url_esperada)

    def test_contrato_sem_autenticacao(self):
        self.client.credentials()  
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_criar_contrato(self):
        data = {
            'crianca': self.crianca.id,
            'data_assinatura': date.today(),
            'data_validade': date.today() + timedelta(days=365),
            'observacoes': 'Contrato anual com cláusulas padrão.'
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['crianca'], self.crianca.id)

    def test_atualizar_contrato(self):
        contrato = Contrato.objects.create(
            crianca=self.crianca,
            data_assinatura=date.today(),
            data_validade=date.today() + timedelta(days=180),
            observacoes='Contrato antigo'
        )

        url = reverse('contrato-detail', kwargs={'pk': contrato.pk})
        novos_dados = {'observacoes': 'Contrato atualizado'}
        response = self.client.patch(url, novos_dados, format='json')

        self.assertEqual(response.status_code, 200)
        contrato.refresh_from_db()
        self.assertEqual(contrato.observacoes, 'Contrato atualizado')

    def test_deletar_contrato(self):
        contrato = Contrato.objects.create(
            crianca=self.crianca,
            data_assinatura=date.today(),
            data_validade=date.today() + timedelta(days=180)
        )

        url_detail = reverse('contrato-detail', kwargs={'pk': contrato.pk})
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Contrato.objects.filter(pk=contrato.pk).exists())
