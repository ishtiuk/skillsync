'use client';
import { useEffect } from 'react';
import { Typography } from '../typography';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import { JobStatus, statusStyles } from '../migrate-to/MigratoTo';
import { cn } from '../../lib/utils';

type EditorProps = {
  content: string;
  stage?: JobStatus;
  editorClassName?: string;
  onUpdate: (content: string) => void;
};

const Editor = (props: EditorProps) => {
  const editor = useEditor({
    content: props.content,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right']
      })
    ],
    onUpdate: ({ editor }) => props.onUpdate(editor.getHTML())
  });

  useEffect(() => {
    if (editor) {
      editor?.chain().focus().setTextAlign('left').run();
    }
  }, []);

  const checkIfAnyMarkIsActive = () => {
    if (!editor) return false;

    const nodes = ['bulletList', 'orderedList'];
    const textAligns = ['center', 'right']; // Exclude 'left' from the check
    const marks = ['bold', 'italic', 'underline', 'strike'];

    const doc = editor.state.doc;
    let isActive = false;

    doc.descendants(node => {
      if (isActive) return false; // Stop traversal if already found active marks/nodes
      if (node.marks.some(mark => marks.includes(mark.type.name))) {
        isActive = true;
      }
      if (nodes.includes(node.type.name)) {
        isActive = true;
      }
      if (node.attrs.textAlign && textAligns.includes(node.attrs.textAlign)) {
        isActive = true;
      }
    });

    return !isActive;
  };

  return (
    <div className="break-words whitespace-pre-wrap max-w-[1024px] overflow-hidden h-full rounded-[16px]">
      <nav className="flex items-center gap-4 p-4 bg-white shadow-customShadow rounded-[16px] mx-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`transition-colors duration-200 ease-in-out hover:bg-neutral-n-200 hover:shadow-customshadow inline-flex items-center justify-center relative w-8 h-8 rounded-[8px] ${
            editor?.isActive('bold')
              ? 'bg-neutral-n-200 shadow-customShadow'
              : ''
          }`}
        >
          <PhosphorIcon
            iconVariant="TextB_regular"
            className={`hover:fill-black ${editor?.isActive('bold') ? `fill-black` : `fill-neutral-n-600`}`}
          />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`transition-colors duration-200 ease-in-out hover:bg-neutral-n-200 hover:shadow-customshadow inline-flex items-center justify-center relative w-8 h-8 rounded-[8px] ${
            editor?.isActive('italic')
              ? 'bg-neutral-n-200 shadow-customShadow'
              : ''
          }`}
        >
          <PhosphorIcon
            iconVariant="TextItalic_regular"
            className={`hover:fill-black ${editor?.isActive('italic') ? `fill-black` : `fill-neutral-n-600`}`}
          />
        </button>

        <div className="flex gap-4 bg-neutral-100 rounded-[8px] px-1 py-1">
          <button
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] ${
              checkIfAnyMarkIsActive() ? 'bg-white shadow-customShadow' : ''
            }`}
            onClick={() =>
              editor
                ?.chain()
                .selectAll()
                .focus()
                .clearNodes()
                .unsetAllMarks()
                .setTextAlign('left')
                .run()
            }
          >
            <PhosphorIcon
              iconVariant="Minus_regular"
              className={`hover:fill-black  ${checkIfAnyMarkIsActive() ? 'fill-black' : 'fill-neutral-n-600'}`}
            />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] ${
              editor?.isActive('underline')
                ? 'bg-white shadow-customShadow'
                : ''
            }`}
          >
            <PhosphorIcon
              iconVariant="TextUnderline_regular"
              className={`hover:fill-black ${editor?.isActive('underline') ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] ${
              editor?.isActive('strike') ? 'bg-white shadow-customShadow' : ''
            }`}
          >
            <PhosphorIcon
              iconVariant="TextStrikethrough_regular"
              className={`hover:fill-black ${editor?.isActive('strike') ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>
        </div>

        <div className="flex gap-4 bg-neutral-100 rounded-[8px] px-1 py-1">
          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] 
            ${editor?.isActive({ textAlign: 'left' }) ? 'bg-white shadow-customShadow' : ''}`}
          >
            <PhosphorIcon
              iconVariant="TextAlignLeft_regular"
              className={`hover:fill-black ${editor?.isActive({ textAlign: 'left' }) ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] 
            ${editor?.isActive({ textAlign: 'center' }) ? 'bg-white shadow-customShadow' : ''}`}
          >
            <PhosphorIcon
              iconVariant="TextAlignCenter_regular"
              className={`hover:fill-black ${editor?.isActive({ textAlign: 'center' }) ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] 
            ${editor?.isActive({ textAlign: 'right' }) ? 'bg-white shadow-customShadow' : ''}`}
          >
            <PhosphorIcon
              iconVariant="TextAlignRight_regular"
              className={`hover:fill-black ${editor?.isActive({ textAlign: 'right' }) ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>
        </div>

        <div className="flex gap-4 bg-neutral-100 rounded-[8px] px-1 py-1">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] ${
              editor?.isActive('bulletList')
                ? 'bg-white shadow-customShadow'
                : ''
            }`}
          >
            <PhosphorIcon
              iconVariant="ListBullets_regular"
              className={`hover:fill-black ${editor?.isActive('bulletList') ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`transition-colors duration-200 ease-in-out hover:bg-white hover:shadow-customshadow inline-flex items-center justify-center relative w-10 h-8 rounded-[8px] ${
              editor?.isActive('orderedList')
                ? 'bg-white shadow-customShadow'
                : ''
            }`}
          >
            <PhosphorIcon
              iconVariant="ListNumbers_regular"
              className={`hover:fill-black ${editor?.isActive('orderedList') ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>
        </div>

        <div className="ml-auto flex gap-4 px-2 py-1">
          <button
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <PhosphorIcon
              iconVariant="ArrowUUpLeft_regular"
              className={`${editor?.can().undo() ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <PhosphorIcon
              iconVariant="ArrowUUpRight_regular"
              className={`${editor?.can().redo() ? `fill-black` : `fill-neutral-n-600`}`}
            />
          </button>
        </div>
      </nav>

      <div className="p-2 h-[80%]">
        <div className="flex flex-col mt-4 shadow-customShadow bg-white rounded-[16px] h-full">
          {!!props.stage && (
            <div
              className={`flex items-center gap-2 p-4 rounded-tr-[16px] rounded-tl-[16px] ${
                statusStyles[props.stage].selected
              }`}
            >
              <PhosphorIcon
                size={18}
                iconVariant="Notepad_fill"
                className={statusStyles[props.stage].text}
              />

              <Typography
                variant="body-strong"
                className={statusStyles[props.stage].text}
              >
                Your Notes
              </Typography>
            </div>
          )}

          <EditorContent
            editor={editor}
            placeholder="Type here..."
            className={cn(
              `editor-content overflow-hidden p-2`,
              props.editorClassName
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
