"""bus_ticketing_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

from bus_ticketing_api import views
from bus_ticketing_api.urls import api_router
from bus_ticketing_app import settings

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', views.health_check),
    path('', include(api_router.urls)),
    path('api/', include(api_router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth', obtain_auth_token),
    path('admin/', admin.site.urls),
    path('health_check', views.health_check),
    path('download/ticket', views.TicketDownloadView.as_view()),
]
              # + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
