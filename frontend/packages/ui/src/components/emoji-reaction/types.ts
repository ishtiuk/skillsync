import { IconVariant } from '@/icons/PhosphorIcon';

const REACTIONS = [
  'nervous',
  'happy',
  'meh',
  'surprised',
  'excited',
  'shocked'
] as const;

type Reaction = (typeof REACTIONS)[number];

type EmojiProps = {
  title: string;
  icon: IconVariant;
  text: string;
  fill: string;
  hover: string;
};

const EMOJI_STYLES: Record<Reaction, EmojiProps> = {
  nervous: {
    title: 'Nervous',
    icon: 'SmileyNervous_fill',
    text: 'text-purple-p-500',
    fill: 'fill-purple-p-500',
    hover: 'hover:fill-purple-p-500'
  },
  happy: {
    title: 'Happy',
    icon: 'Smiley_fill',
    text: 'text-primary-g-600',
    fill: 'fill-primary-g-600',
    hover: 'hover:fill-primary-g-600'
  },
  surprised: {
    title: 'Surprised',
    icon: 'SmileyBlank_fill',
    text: 'text-blue-b-500',
    fill: 'fill-blue-b-500',
    hover: 'hover:fill-blue-b-500'
  },
  meh: {
    title: 'Meh.',
    icon: 'SmileyMeh_fill',
    text: 'text-orange-o-500',
    fill: 'fill-orange-o-500',
    hover: 'hover:fill-orange-o-500'
  },
  excited: {
    title: 'Excited',
    icon: 'Heart_fill',
    text: 'text-red-r-600',
    fill: 'fill-red-r-600',
    hover: 'hover:fill-red-r-600'
  },
  shocked: {
    title: 'Shocked',
    icon: 'SmileyXEyes_fill',
    text: 'text-yellow-y-500',
    fill: 'fill-yellow-y-500',
    hover: 'hover:fill-yellow-y-500'
  }
};

export { REACTIONS, type Reaction, EMOJI_STYLES };
