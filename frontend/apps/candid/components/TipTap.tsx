'use client';
import Image from 'next/image';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { useEditor, EditorContent } from '@tiptap/react';

type TiptapProps = {
  content: string;
  onUpdate: (content: string) => void;
};
const Tiptap = (props: TiptapProps) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      props.onUpdate(editor.getHTML());
    },
    extensions: [StarterKit, Underline],
    content: props.content
  });

  return (
    <div className="border border-neutral-n-300 rounded-[4px] bg-neutral-n-100 break-words whitespace-pre-wrap  max-w-[800px] overflow-hidden">
      <nav className="flex gap-4 p-4 border-b border-neutral-n-300">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`inline-flex items-center justify-center relative w-8 h-8 rounded-[4px] ${
            editor?.isActive('bold') ? 'bg-neutral-n-400' : ''
          }`}
        >
          <Image src="/images/bold.svg" alt="Bold" width={16} height={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`inline-flex items-center justify-center relative w-8 h-8 rounded-[4px] ${
            editor?.isActive('italic') ? 'bg-neutral-n-400' : ''
          }`}
        >
          <Image src="/images/italic.svg" alt="Italic" width={8} height={8} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`inline-flex items-center justify-center relative w-8 h-8 rounded-[4px] ${
            editor?.isActive('underline') ? 'bg-neutral-n-400' : ''
          }`}
        >
          <Image
            width={16}
            height={16}
            alt="Underline"
            src="/images/underline.svg"
          />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`inline-flex items-center justify-center relative w-8 h-8 rounded-[4px] ${
            editor?.isActive('orderedList') ? 'bg-neutral-n-400' : ''
          }`}
        >
          <Image
            width={24}
            height={24}
            alt="OrderedList"
            src="/images/ordered-list.svg"
          />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`inline-flex items-center justify-center relative w-8 h-8 rounded-[4px] ${
            editor?.isActive('bulletList') ? 'bg-neutral-n-400' : ''
          }`}
        >
          <PhosphorIcon
            iconVariant="ListBullets_fill"
            className="fill-neutral-n-800"
          />
        </button>
      </nav>

      <EditorContent
        editor={editor}
        className="editor-content overflow-hidden"
      />
    </div>
  );
};

export default Tiptap;
