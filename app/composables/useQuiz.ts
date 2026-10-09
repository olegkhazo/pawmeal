import {
  createEmptyContactAnswers,
  createEmptyDraftAnswers,
  QUIZ_DRAFT_STORAGE_KEY,
  QUIZ_DRAFT_TTL_MS,
  QUIZ_DRAFT_VERSION,
  QUIZ_STEP_COUNT,
  type QuizContactAnswers,
  type QuizDraft,
  type QuizDraftAnswers,
} from '~~/shared/types/quiz'

function loadDraftFromStorage(): { step: number; answers: QuizDraftAnswers } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(QUIZ_DRAFT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuizDraft
    if (parsed.version !== QUIZ_DRAFT_VERSION) return null
    if (Date.now() - parsed.savedAt > QUIZ_DRAFT_TTL_MS) return null
    return { step: parsed.step, answers: { ...createEmptyDraftAnswers(), ...parsed.answers } }
  } catch {
    return null
  }
}

function persistDraftToStorage(step: number, answers: QuizDraftAnswers) {
  if (typeof window === 'undefined') return
  const draft: QuizDraft = { version: QUIZ_DRAFT_VERSION, savedAt: Date.now(), step, answers }
  try {
    window.sessionStorage.setItem(QUIZ_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // sessionStorage can throw in private-browsing/quota-exceeded situations — draft
    // persistence is a convenience, not a requirement for completing the quiz.
  }
}

export function useQuiz() {
  const step = useState<number>('quiz-step', () => 1)
  const answers = useState<QuizDraftAnswers>('quiz-answers', () => createEmptyDraftAnswers())
  // Contact fields never touch sessionStorage — see shared/types/quiz.ts.
  const contact = useState<QuizContactAnswers>('quiz-contact', () => createEmptyContactAnswers())
  const hydrated = useState<boolean>('quiz-hydrated', () => false)

  function hydrateFromStorageOrQuery(query: Record<string, unknown>) {
    if (hydrated.value) return
    hydrated.value = true

    const draft = loadDraftFromStorage()
    if (draft) {
      step.value = Math.min(Math.max(draft.step, 1), QUIZ_STEP_COUNT)
      answers.value = draft.answers
      return
    }

    const querySpecies = query.species
    if (querySpecies === 'dog' || querySpecies === 'cat') {
      answers.value.species = querySpecies
    }
    const queryRecipeId = query.recipeId
    if (typeof queryRecipeId === 'string' && queryRecipeId) {
      answers.value.preferredRecipeIds = [queryRecipeId]
    }
  }

  function persist() {
    persistDraftToStorage(step.value, answers.value)
  }

  function goNext() {
    if (step.value < QUIZ_STEP_COUNT) {
      step.value += 1
      persist()
    }
  }

  function goBack() {
    if (step.value > 1) {
      step.value -= 1
      persist()
    }
  }

  function clearDraft() {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(QUIZ_DRAFT_STORAGE_KEY)
      } catch {
        // best-effort cleanup
      }
    }
    step.value = 1
    answers.value = createEmptyDraftAnswers()
    contact.value = createEmptyContactAnswers()
    hydrated.value = false
  }

  return { step, answers, contact, hydrateFromStorageOrQuery, persist, goNext, goBack, clearDraft }
}
