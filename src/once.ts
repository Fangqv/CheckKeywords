type OnceAction<T> = () => T | null

export async function onceFind<T>(
  options: (Partial<{ ms: number; timeout: number; id?: string }> & { action: OnceAction<T> }) | OnceAction<T>,
) {
  let action: () => T | null
  let ms = 10
  let timeout = 5000
  let id: string | undefined
  if (typeof options === 'function') {
    action = options
  } else {
    ms = options.ms || 10
    timeout = options.timeout || 5000
    action = options.action
    id = options.id
  }
  return new Promise<T>((resolve, reject) => {
    if (typeof action !== 'function') {
      const rejectInfo = 'action is not a function!' + (id ? `[${id}]` : '')
      reject(rejectInfo)
    } else {
      const timer = setInterval(() => {
        const element = action()
        if (element) {
          clearInterval(timer)
          resolve(element)
        }
      }, ms)

      setTimeout(() => {
        clearInterval(timer)
        const rejectInfo = `timeout: ${timeout}` + (id ? `[${id}]` : '')
        reject(rejectInfo)
      }, timeout)
    }
  })
}
