# myapp/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Article, CustomUser
from .serializers import RegisterSerializer, LoginSerializer, ArticleSerializer
from rest_framework.authtoken.models import Token
from .permissions import SessionIdPermission  

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            user.session_id = token.key
            user.save()
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [SessionIdPermission]

    def post(self, request):
        if request.user.auth_token:
            request.user.auth_token.delete()


        request.user.session_id = ''
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserIdView(APIView):
    permission_classes = [SessionIdPermission]

    def get(self, request):
        user = request.user
        return Response({'user_id': user.id}, status=status.HTTP_200_OK)


class ArticleListView(APIView):
    def get(self, request):
        session_id = request.headers.get('Authorization', '').replace('Token ', '')
        print('session_id',session_id)
        if session_id:
            try:
                user = CustomUser.objects.get(session_id=session_id)
            except CustomUser.DoesNotExist:
                user = None
        else:
            user = None

        if user:
            articles = Article.objects.all()
        else:
            articles = Article.objects.filter(is_private=False)

        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)


class ArticleDetailView(APIView):
    def get(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


        serializer = ArticleSerializer(article)
        return Response(serializer.data)


class ArticleCreateView(APIView):
    permission_classes = [SessionIdPermission]

    def post(self, request):
        if request.user.role != 'author':
            return Response({'detail': 'You do not have permission to create an article'},
                            status=status.HTTP_403_FORBIDDEN)


        serializer = ArticleSerializer(data=request.data, context={'request': request})
        print(serializer)
        if serializer.is_valid():
            print(serializer)
            article = serializer.save()
            return Response(ArticleSerializer(article).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArticleUpdateView(APIView):
    permission_classes = [SessionIdPermission]

    def put(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        print(article)
        if article.author != request.user:
            return Response({'error': 'You are not the author of this article.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDeleteView(APIView):
    permission_classes = [SessionIdPermission]

    def delete(self, request, pk, format=None):
        try:
            article = Article.objects.get(pk=pk)
            if request.user == article.author:
                article.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'detail': 'You do not have permission to delete this article.'}, status=status.HTTP_403_FORBIDDEN)
        except Article.DoesNotExist:
            return Response({'detail': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)

class ArticleDeleteView(APIView):
    permission_classes = [SessionIdPermission]

    def delete(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if article.author != request.user:
            raise PermissionDenied('You do not have permission to delete this article')

        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([SessionIdPermission])
def current_user(request):
    user = request.user
    return Response({'user_id': user.id})
