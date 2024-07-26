from django.core.validators import validate_email
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.admin import User
from rest_framework.exceptions import ValidationError

from .models import CustomUser, Article


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")


        if user and user.check_password(password):
            return {
                'user': user
            }


def validate_password(value):
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long.')
    if not any(char.isdigit() for char in value):
        raise ValidationError('Password must contain at least one digit.')
    if not any(char.isalpha() for char in value):
        raise ValidationError('Password must contain at least one letter.')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'role']

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")

        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")

        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='subscriber'
        )
        return user

# serializers.py


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'is_private', 'author']
        extra_kwargs = {
            'author': {'required': False}  # Поле author не обязательно в сериализаторе
        }

    def create(self, validated_data):
        user = self.context['request'].user
        return Article.objects.create(author=user, **validated_data)
