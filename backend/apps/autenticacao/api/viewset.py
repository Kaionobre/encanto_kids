from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.autenticacao.api.serializer import CustomUserSerializer
from rest_framework.permissions import AllowAny  # << IMPORTAR AQUI

User = get_user_model()


class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]  # << ADICIONAR/MODIFICAR ESTA LINHA

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # A lógica de criar o Responsavel já está no seu serializer
        return Response({"message": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
