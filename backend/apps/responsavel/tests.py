from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from apps.responsavel.models import Responsavel  

class ResponsavelURLsTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )

        self.client = APIClient()
        self.url = reverse('responsavel-list') 
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.token = response.data['access']

    def test_responsavel_url_esta_correta(self):
        url_esperada = '/api/responsavel/' 
        self.assertEqual(self.url, url_esperada)

    def test_responsavel_sem_autenticacao(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_criar_responsavel(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        data = {
            'user': self.user.id,
            'nome': 'Kaio Brito',
            'cpf': '123.456.789-00',
            'email': 'kaio@email.com',
            'telefone': '(83)99999-9999'
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nome'], data['nome'])

    def test_atualizar_responsavel(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        responsavel = Responsavel.objects.create(
            user=self.user,
            nome='Kaio',
            cpf='123.456.789-00',
            email='kaio@email.com',
            telefone='(83)99999-9999'
        )

        url = reverse('responsavel-detail', kwargs={'pk': responsavel.pk})
        novo_nome = {'nome': 'Kaio Nóbrega Brito'}
        response = self.client.patch(url, novo_nome, format='json')

        self.assertEqual(response.status_code, 200)
        responsavel.refresh_from_db()
        self.assertEqual(responsavel.nome, 'Kaio Nóbrega Brito')

    def test_deletar_responsavel(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        responsavel = Responsavel.objects.create(
            user=self.user,
            nome='Kaio',
            cpf='123.456.789-00',
            email='kaio@email.com',
            telefone='(83)99999-9999'
        )

        url_detail = reverse('responsavel-detail', kwargs={'pk': responsavel.pk})
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Responsavel.objects.filter(pk=responsavel.pk).exists())
