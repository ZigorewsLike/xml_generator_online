from rest_framework import routers
from .views import OptViewSet, BoxViewSet

router = routers.DefaultRouter()
router.register('opt', OptViewSet)
router.register('bbox', BoxViewSet)


urlpatterns = router.urls