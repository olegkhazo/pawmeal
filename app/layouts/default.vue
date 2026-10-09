<template>
  <div class="flex min-h-screen flex-col bg-brand-bg text-brand-text">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
