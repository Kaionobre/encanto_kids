from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.responsavel.models import Responsavel
from apps.pacote.models import Pacote
from apps.crianca.models import Crianca

class CriancaURLsTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )

        self.client = APIClient()
        self.url = reverse('crianca-list')

        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.responsavel = Responsavel.objects.create(
            user=self.user,
            nome='Kaio Nóbrega',
            cpf='123.456.789-00',
            email='kaio@email.com',
            telefone='(83)99999-9999'
        )

        self.pacote = Pacote.objects.create(
            nome='Pacote Infantil',
            descricao='Atividades para crianças pequenas',
            tipo='meio',
            status='ativo'
        )

    def test_crianca_url_esta_correta(self):
        url_esperada = '/api/crianca/'  
        self.assertEqual(self.url, url_esperada)

    def test_crianca_sem_autenticacao(self):
        self.client.credentials()  
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_criar_crianca(self):
        data = {
            'nome': 'Joaquim',
            'idade': 6,
            'turno': 'manha',
            'tipo_de_pacote': self.pacote.id,
            'status': True,
            'responsavel': self.responsavel.id
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nome'], data['nome'])

    def test_atualizar_crianca(self):
        crianca = Crianca.objects.create(
            nome='Ana',
            idade=7,
            turno='tarde',
            tipo_de_pacote=self.pacote,
            status=True,
            responsavel=self.responsavel
        )

        url = reverse('crianca-detail', kwargs={'pk': crianca.pk})
        novo_nome = {'nome': 'Ana Luiza'}
        response = self.client.patch(url, novo_nome, format='json')

        self.assertEqual(response.status_code, 200)
        crianca.refresh_from_db()
        self.assertEqual(crianca.nome, 'Ana Luiza')

    def test_deletar_crianca(self):
        crianca = Crianca.objects.create(
            nome='Pedro',
            idade=8,
            turno='integral',
            tipo_de_pacote=self.pacote,
            status=True,
            responsavel=self.responsavel
        )

        url_detail = reverse('crianca-detail', kwargs={'pk': crianca.pk})
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Crianca.objects.filter(pk=crianca.pk).exists())
