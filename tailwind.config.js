/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
    theme: {

      scale: {
        '0': '0',
        '25': '.25',
        '50': '.5',
        '75': '.75',
        '90': '.9',
        '95': '.95',
        '100': '1',
        '105': '1.04',
        '110': '1.1',
        '125': '1.25',
        '150': '1.5',
        '200': '2',
      },
      extend: {

     
        screens: {
          '2xl': '1400px',
          '2.5xl':'1536px',
          '3xl': '1920px',
          '4xl':'2560px',
        },
        colors: {
          'primarycolor': "#990a3e",
          'secondarycolor': "#2B2730",
          'sidebartext': "#a29b9b",
          'lightwhite': "#ffeaea",
          'breadcrumbactive': "#ecc2c2",
          'sidebartexthover': "#616166",
          'buttnhover': "#e84646",
          'txtcolor': "#090909",
          'paracolor': "#757575",
          'primarylight': "#E91E63",
          'buttncolor': "#9248B1",
          'yellowcolor':'#FFC107',
          'greencolor':'#7bb13c',
          'lightgrayy' : '#afafaf',
          'inputborder' : '#D9D9D9',
          'inputfocusborder' : '#1d1d20',
       
  
        },
        fontFamily: {
          playfair: ['var(--font-playfair)', 'serif'],
          libre: ['var(--font-libre)', 'serif'],
          satoshi: ['var(--font-satoshi)', 'sans-serif'],
          satoshiItalic: ['var(--font-satoshiItalic)', 'sans-serif'],
          satoshiBold: 'var(--font-satoshiBold)',
          satoshiBoldItalic: ['var(--font-satoshiBoldItalic)', 'sans-serif'],
          satoshiLight: ['var(--font-satoshiLight)', 'sans-serif'],
          satoshiLightItalic: ['var(--font-satoshiLightItalic)', 'sans-serif'],
          zoho: ['Zoho_Puvi_SemiBold', 'sans-serif'],
          satoshiMedium: "var(--font-satoshiMedium)",

          newbold:"var(--newbolad)"
          
        },
  
        boxShadow: {
          '3xl': '5px 5px 15px #cccccc3d',
          '4xl': '0 0 .688rem rgba(0,0,0,.1)',
        },
        backgroundColor: {
          "overlay12":"#00000012",
          "overlay32": "#00000052",
          "overlay46": "#00000065",
          "overlay50": "#00000080",
          "overlay62": "#0000009e",
        },
  
  
        backgroundImage: {
          "custom-gradient": "linear-gradient(to left,#900C3F,#a6103b)",
          "breadcrumb-gradient": "linear-gradient(to left,#C70039,#900C3F)",
          "h-gradient": "linear-gradient(0deg, rgba(0, 0, 0, .63) 0, rgba(0, 0, 0, .24))",
  
        },
        fontSize: {
          text15: "0.9rem",
          text16: "1rem",
          text18: "1.1rem",
          headingfont: "2rem",
        },
  
      },
    },

}

