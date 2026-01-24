import { UIComponent } from "@/types";

export const components: UIComponent[] = [
  {
    id: '1',
    title: 'Neon Button',
    description: 'A glowing button with hover effects',
    category: 'buttons',
    author: 'Mehedi',
    html: `<button class="neon-btn">Hover Me</button>`,
    css: `.neon-btn {
      padding: 10px 20px;
      background: #000;
      color: #0ff;
      border: 2px solid #0ff;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }
    .neon-btn:hover {
      box-shadow: 0 0 15px #0ff;
      background: #0ff;
      color: #000;
    }`
  },
  {
    id: '2',
    title: 'Glass Card',
    description: 'Modern glassmorphism effect',
    category: 'cards',
    author: 'Mehedi',
    html: `<div class="glass-card"><h1>Card</h1></div>`,
    css: `.glass-card {
      width: 200px;
      height: 100px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }`
  }
];