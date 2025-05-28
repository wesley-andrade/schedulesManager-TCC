export const theme = {
  colors: {
    primary: {
      main: 'bg-blue-600',
      light: 'bg-blue-400',
      dark: 'bg-blue-800',
      text: 'text-white',
    },
    secondary: {
      main: 'bg-purple-600',
      light: 'bg-purple-400',
      dark: 'bg-purple-800',
      text: 'text-white',
    },
    error: {
      main: 'bg-red-600',
      light: 'bg-red-400',
      dark: 'bg-red-800',
      text: 'text-white',
    },
    warning: {
      main: 'bg-orange-600',
      light: 'bg-orange-400',
      dark: 'bg-orange-800',
      text: 'text-white',
    },
    info: {
      main: 'bg-cyan-600',
      light: 'bg-cyan-400',
      dark: 'bg-cyan-800',
      text: 'text-white',
    },
    success: {
      main: 'bg-green-600',
      light: 'bg-green-400',
      dark: 'bg-green-800',
      text: 'text-white',
    },
  },
  typography: {
    h1: 'text-4xl font-medium',
    h2: 'text-3xl font-medium',
    h3: 'text-2xl font-medium',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
  },
  components: {
    button: {
      base: 'rounded-lg px-4 py-2 font-medium transition-colors',
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700',
      error: 'bg-red-600 text-white hover:bg-red-700',
      warning: 'bg-orange-600 text-white hover:bg-orange-700',
      info: 'bg-cyan-600 text-white hover:bg-cyan-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
    },
    card: {
      base: 'rounded-xl shadow-md p-4',
    },
  },
} as const; 