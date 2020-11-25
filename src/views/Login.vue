<template>
  <div>
    My App
  </div>
</template>

<script>
import authService from '../common/authService';
(async () => {
  await authService.login('nariyuki@example.com', 'hogehoge');
})();
</script>
