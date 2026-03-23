from django.contrib import admin
from django.urls import path, re_path
from django.http import JsonResponse
from django.views.generic import TemplateView
from backend.app.views import create_student, list_students, view_student, update_student, delete_student

def test_api(request):
    return JsonResponse({"message": "Hello from first Django and MySQL!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', test_api),
    path('api/students/create/', create_student, name='create_student'),
    path('api/students/', list_students, name='list_students'),
    path('api/students/<int:student_id>/', view_student, name='view_student'),
    path('api/students/<int:student_id>/update/', update_student, name='update_student'),
    path('api/students/<int:student_id>/delete/', delete_student, name='delete_student'),
    # Serve React app for all other routes
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]