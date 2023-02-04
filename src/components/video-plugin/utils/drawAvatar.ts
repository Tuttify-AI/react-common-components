import { User } from '../types';

export const drawAvatar = (container: HTMLElement, user: User, background: string, canvas: HTMLCanvasElement) => {
  //const { width, height } = container.getBoundingClientRect();

  const name = `${user.first_name} ${user.last_name}`;

  const canvasWidth = 1640;
  const canvasHeight = 1640;

  canvas.width = canvasWidth; //width;
  canvas.height = canvasHeight; //height;

  const size = Math.sqrt(canvas.width * canvas.height);

  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = background;

    context.fillRect(0, 0, canvas.width, canvas.height);
    context.stroke();

    context.fillStyle = '#32323C';
    context.font = `${size * 0.4}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
  }

  let text = '';
  const names = name.split(' ').filter(item => item.length !== 0);

  if (names.length > 0) {
    text = names[0][0];
    if (names.length > 1) {
      text = text + names[names.length - 1][0];
    }
  } else {
    text = '?';
  }

  if (context) {
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const imageData = canvas.toDataURL('image/png');

  return imageData;
};
