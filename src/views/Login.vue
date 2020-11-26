<template>
  <div>My App</div>
</template>

<script>
import authService from '@/services/authService';
(async () => {
  const result = await authService.login('nariyuki@example.com', 'hogehoge');
  console.log(result);
  const isLogged = await authService.checkAuth();
  console.log('logged in?', isLogged);
})();
</script>
