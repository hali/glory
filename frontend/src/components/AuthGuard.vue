<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
const route = useRoute();

onMounted(() => {
  if (!isLoading.value && !isAuthenticated.value) {
    loginWithRedirect({ appState: { targetUrl: route.fullPath } });
  }
});
</script>
