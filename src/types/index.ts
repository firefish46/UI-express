export interface UIComponent {
  id: string;
  title: string;
  description: string;
  category: 'buttons' | 'cards' | 'inputs' | 'navbars';
  html: string;
  css: string;
  author: string;
}