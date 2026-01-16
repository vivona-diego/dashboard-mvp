declare module '*.css';
declare module '*.scss';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      text: {
        title: string;
        primaryButton: string;
        secondaryButton: string;
      };
      button: {
        primary: string;
        secondary: string;
        outlinedSecondary: string;
      };
      filterBar: {
        background: string;
        button: string;
        buttonHover: string;
        buttonSelected: string;
        buttonOutlined: string;
        buttonText: string;
      };
      container: {
        title: string;
        background: string;
        horizontalLines: string;
        xyText: string;
        barColumns: string;
        primaryText: string;
        secondaryText: string;
      };
      background: string;
    };
  }
  interface ThemeOptions {
    customColors?: {
      text?: {
        title?: string;
        primaryButton?: string;
        secondaryButton?: string;
      };
      button?: {
        primary?: string;
        secondary?: string;
        outlinedSecondary?: string;
      };
      filterBar?: {
        background?: string;
        button?: string;
        buttonHover?: string;
        buttonSelected?: string;
        buttonOutlined?: string;
        buttonText?: string;
      };
      container?: {
        title?: string;
        background?: string;
        horizontalLines?: string;
        xyText?: string;
        barColumns?: string;
        primaryText?: string;
        secondaryText?: string;
      };
      background?: string;
    };
  }
}
