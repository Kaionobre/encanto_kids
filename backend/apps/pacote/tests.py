from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from apps.pacote.models import Pacote
from django.urls import reverse
from rest_framework.test import APIClient

class PacoteURLsTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.client = APIClient()
        self.url = reverse('pacote-list') 
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.token = response.data['access']  

    def test_pacote_url_esta_correto(self):
        url_esperada = '/api/pacote/'
        self.assertEqual(self.url, url_esperada)

    def test_pacote_sem_autenticacao(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)  

    def test_criar_pacote(self):
        data = {
            'nome': 'Pacote de Férias',
            'descricao': 'Pacote para férias com atividades para crianças',
            'tipo': 'meio',
            'status': 'ativo'
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nome'], data['nome'])

    def test_atualizar_pacote(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        pacote = Pacote.objects.create(nome='Pacote Inicial', tipo='meio', status='ativo')
        url = reverse('pacote-detail', kwargs={'pk': pacote.pk})
        novo_nome = {'nome': 'Pacote Atualizado'}
        response = self.client.patch(url, novo_nome, format='json')

        self.assertEqual(response.status_code, 200)

        pacote.refresh_from_db()
        self.assertEqual(pacote.nome, 'Pacote Atualizado')

    def test_deletar_pacote(self):
        data = {
            'nome': 'Pacote de Férias',
            'descricao': 'Pacote para férias com atividades para crianças',
            'tipo': 'meio',
            'status': 'ativo'
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(self.url, data, format='json')

        pacote_id = response.data['id']
        url_detail = reverse('pacote-detail', kwargs={'pk': pacote_id})

        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pacote.objects.filter(pk=pacote_id).exists())
