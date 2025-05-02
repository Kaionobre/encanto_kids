from rest_framework import serializers
from apps.autenticacao.models import CustomUser
from apps.responsavel.models import Responsavel

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'tipo_usuario', 'password')  
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if CustomUser.objects.filter(username=validated_data['username']).exists():
            raise serializers.ValidationError({'username': 'Esse username já está em uso.'})
        if CustomUser.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'email': 'Esse email já está em uso.'})

        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            tipo_usuario=validated_data['tipo_usuario']
        )
        user.set_password(validated_data['password'])
        user.is_superuser = False
        user.is_staff = False
        user.save()

        if user.tipo_usuario == 'responsavel':
            Responsavel.objects.create(user=user, nome=user.username, email=user.email)

        return user