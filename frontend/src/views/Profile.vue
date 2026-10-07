<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Claim</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(claim, index) in claims"
          :key="index"
        >
          <td>{{ claim.key }}</td>
          <td :id="'claim-' + claim.key">
            {{ claim.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: 'Profile',
  setup() {
    const { user } = useAuth0();
    const claims = computed(() => Object.entries(user.value || {}).map(
      ([key, value]) => ({ key, value })
    ));
    return { claims };
  }
}
</script>
