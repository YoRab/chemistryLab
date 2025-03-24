export const cx = (...args: (string | undefined | boolean)[]) => args.filter(Boolean).join(' ')
