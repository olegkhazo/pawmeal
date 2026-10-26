<script setup lang="ts">
const { t, tm } = useI18n()
const itemCount = (tm('home.testimonials.items') as unknown[]).length

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase()
}

const scroller = useTemplateRef<HTMLDivElement>('scroller')

function scrollByCard(direction: 1 | -1) {
  const el = scroller.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' })
}
</script>

<template>
  <section class="bg-brand-blush py-14">
    <div class="mx-auto max-w-5xl px-4">
      <p class="text-center font-hand text-3xl text-brand-terracotta">
        {{ t('home.testimonials.eyebrow') }}
      </p>
      <h2 class="mt-1 text-center text-3xl text-brand-text sm:text-4xl">
        {{ t('home.testimonials.title') }}
      </h2>

      <div class="relative mt-8">
        <button
          type="button"
          :aria-label="t('home.testimonials.prev')"
          class="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-surface p-2 shadow-sm hover:border-brand-accent sm:flex"
          @click="scrollByCard(-1)"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-brand-text" aria-hidden="true">
            <path d="M12.7 15.3a1 1 0 0 1-1.4 0l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 1 1 1.4 1.4L8.42 9.6H16a1 1 0 1 1 0 2H8.42l4.28 4.3a1 1 0 0 1 0 1.4Z" />
          </svg>
        </button>

        <div
          ref="scroller"
          class="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <figure
            v-for="index in itemCount"
            :key="index"
            class="flex w-[85%] shrink-0 snap-start flex-col gap-4 rounded-[1.75rem] border-2 border-brand-accent bg-brand-surface p-6 sm:w-[45%] lg:w-[31%]"
          >
            <span class="text-lg tracking-widest text-brand-cta" aria-hidden="true">★★★★★</span>
            <blockquote class="text-sm text-brand-text">
              {{ t(`home.testimonials.items.${index - 1}.quote`) }}
            </blockquote>
            <figcaption class="mt-auto flex items-center gap-3">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-salmon font-heading text-sm font-bold text-white"
                aria-hidden="true"
              >
                {{ initials(t(`home.testimonials.items.${index - 1}.name`)) }}
              </span>
              <span class="text-sm text-brand-text-muted">
                <span class="font-medium text-brand-text">{{ t(`home.testimonials.items.${index - 1}.name`) }}</span>,
                {{ t(`home.testimonials.items.${index - 1}.city`) }}
              </span>
            </figcaption>
          </figure>
        </div>

        <button
          type="button"
          :aria-label="t('home.testimonials.next')"
          class="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-surface p-2 shadow-sm hover:border-brand-accent sm:flex"
          @click="scrollByCard(1)"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-brand-text" aria-hidden="true">
            <path d="M7.3 4.7a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4l4.28-4.3H4a1 1 0 1 1 0-2h7.58L7.3 6.1a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
