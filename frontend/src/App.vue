<script setup lang="ts"></script>

<template>
  <div class="flex min-h-svh flex-col">
    <header class="flex h-20 items-center justify-center bg-indigo-300 text-2xl font-extrabold">
      М-обмен
    </header>
    <main class="relative container mx-auto w-full max-w-7xl grow px-4 py-6">
      <RouterView />
    </main>
    <footer class="flex h-40 items-center justify-center bg-black text-white">
      Дополнительная информация
    </footer>
  </div>
</template>
