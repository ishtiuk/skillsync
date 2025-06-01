'use client';

import * as z from 'zod';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import { Tag } from '@workspace/ui/components/tag';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { navigationItems } from '@/lib/constants/navigationItems';
import { Button } from '@workspace/ui/components/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@workspace/ui/components/slider/Slider';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { Typography } from '@workspace/ui/components/typography';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger
} from '@workspace/ui/components/dialog/Dialog';

import React, {
  useRef,
  useState,
  useEffect,
  BaseSyntheticEvent,
  ReactElement
} from 'react';
import { ProgressLinear } from '@workspace/ui/components/progress-meter/ProgressLinear';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@workspace/ui/components/tabs/Tabs';

import {
  PathwayTag,
  industryTypes
} from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { getJobRoleByIdOptions } from '@/app/jobs/_modules/api/queries/getJobRoles';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import Editor from '@workspace/ui/components/rich-text-editor/Editor';
import { Reaction } from '@workspace/ui/components/emoji-reaction/types';
import { EmojiPicker } from '@workspace/ui/components/emoji-reaction/EmojiPicker';
import {
  JobStatus,
  MigrateTo
} from '@workspace/ui/components/migrate-to/MigratoTo';
import { updateTrackedJob } from '../_modules/api/mutations/updateTrackedJob';
import { getTrackedJobByIdOptions } from '../_modules/api/queries/getTrackedJobs';

import useDebounce from '@workspace/ui/hooks/useDebounce';
import { JobStage } from '@workspace/ui/components/jobs-table/types';
import TonePicker, {
  type TonePosition,
  type ToneValues
} from '@workspace/ui/components/tone-picker/TonePicker';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Dropdown, Form, TextInput } from '@workspace/ui/components/form';
import { generateCoverLetter } from '../_modules/api/mutations/generateCoverLetter';
import { ContextualAlert } from '@workspace/ui/components/contextual-alerts/ContextualAlert';
import SegmentedControl from '@workspace/ui/components/segmented-controller/SegmentedController';
import { GenerateCoverLetterRequest } from '../_modules/types';
import GenerateWithPoppy from '../_modules/comps/GenerateWithPoppy';
import HtmlRenderer from '@/components/HTMLRenderer';
import { Toaster } from '@workspace/ui/components/sonner/Sonner';
import Loader from '@workspace/ui/components/loader/Loader';
import CoverLetterCards from '../_modules/comps/CoverLetterCards';

type GeneratedWithPoppyAlertProps = {
  toastId: string | number;
  onGenerateAgain: () => void;
};

const getReducedTones = (values: ToneValues) => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Number(value) / 100
    }),
    {}
  );
};

const getReducedTopics = (topics: TopicSchema[]) => {
  return topics.reduce((acc: Record<string, number>, topic) => {
    acc[topic.topic_name] = Number(topic.range) / 100;
    return acc;
  }, {});
};

const GeneratedWithPoppyAlert = ({
  toastId,
  onGenerateAgain
}: GeneratedWithPoppyAlertProps) => {
  const handleGenerateAgain = () => {
    onGenerateAgain();
    toast.dismiss(toastId);
  };

  return (
    <div className="mx-auto w-[700px] -ml-[340px]">
      <div className="bg-white px-6 py-6 flex justify-between items-center gap-4 rounded-[16px] shadow-[2px_8px_16px_0px_#1F1D1C29] backdrop-blur-[24px]">
        <div className="flex items-center gap-2">
          <Image
            width={20}
            height={20}
            alt="Poppy Logo"
            src="/images/poppy-logo.svg"
            className="w-[20px] h-[20px] object-cover"
          />

          <Typography variant="caption-strong">Generated with Poppy</Typography>
        </div>

        <div className="flex">
          <Button
            size="default"
            variant="tertiary"
            label="Generate Again"
            onClick={handleGenerateAgain}
            className="bg-blue-100 text-primary-g-800"
          />
        </div>
      </div>
    </div>
  );
};

const exportCoverLetterSchema = z.object({
  file_type: z.enum(['pdf', 'docx'])
});

const generateCoverLetterSchema = z.object({
  topics: z
    .array(
      z.object({
        topic_name: z.string().min(1, 'Topic name is required'),
        range: z.number().min(0, 'Range is required')
      })
    )
    .refine(data => data.length > 0, {
      message: 'At least one topic is required'
    }),

  tone: z.object({
    casual: z.number(),
    concise: z.number(),
    expanded: z.number(),
    professional: z.number()
  }),

  style: z.enum(['classic', 'modern', 'simple'])
});

const topicSchema = z.object({
  topic_name: z.string().min(1, 'Topic name is required'),
  range: z.number().min(0, 'Range is required')
});

type TopicSchema = z.infer<typeof topicSchema>;
type ExportCoverLetterSchema = z.infer<typeof exportCoverLetterSchema>;
type GenerateCoverLetterSchema = z.infer<typeof generateCoverLetterSchema>;

export default function JobTrackingPage(): ReactElement {
  const initialToggle = 0;
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = getQueryClient();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'notes' | 'cover-letter'>('notes');

  const jobId = searchParams.get('jobId') as string;

  const hasSalary = (min: number | null, max: number | null) => {
    if (min === null && max === null) {
      return 'Negotiable';
    }

    if (min === undefined && max === undefined) {
      return 'Negotiable';
    }

    if (min === null && max !== null) {
      return `$${max?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    if (max === null && min !== null) {
      return `$${min?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    if (min === max) {
      return `$${min?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    return `$${min
      ?.toString()
      ?.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      )} - $${max?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const hasEducation = (education: string | null) => {
    if (!!!education) {
      return 'Not Specified';
    }

    return `${education} preferred`;
  };

  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<TopicSchema[]>([
    {
      topic_name: 'Professional',
      range: 50
    },
    {
      topic_name: 'Casual',
      range: 50
    },
    {
      topic_name: 'Brevity',
      range: 50
    }
  ]);

  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [jobStatus, setJobStatus] = useState<JobStatus>('saved');
  const [editorContent, setEditorContent] = useState<string>('');
  const [coverLetterText, setCoverLetterText] = useState<string>('');
  const [toneValues, setToneValues] = useState<ToneValues | null>(null);
  const [position, setPosition] = useState<TonePosition>({ x: 4, y: 3 });
  const [isInitialCoverLetter, setIsInitialCoverLetter] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: 'cover-letter'
  });

  const modernRef = useRef();
  const simpleRef = useRef();
  const classicRef = useRef();

  const debouncedContent = useDebounce(editorContent, 500);
  const debouncedCoverLetterText = useDebounce(coverLetterText, 500);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const exportCoverLetterForm = useForm<ExportCoverLetterSchema>({
    resolver: zodResolver(exportCoverLetterSchema),
    mode: 'onSubmit'
  });

  const coverLetterForm = useForm<GenerateCoverLetterSchema>({
    resolver: zodResolver(generateCoverLetterSchema),
    defaultValues: {
      topics: [...topics],
      style: 'classic',
      tone: toneValues!
    },
    mode: 'onSubmit'
  });

  const topicForm = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      topic_name: '',
      range: 50
    }
  });

  const getTrackedJobById = useQuery({
    ...getTrackedJobByIdOptions,
    queryKey: ['trackedJobId', jobId],
    enabled: !!jobId
  });

  const updateTrackedJobForm = useForm({
    resolver: zodResolver(z.object({})),
    defaultValues: {
      notes: ''
    },
    mode: 'onSubmit'
  });

  const updateTrackedJobMutation = useMutation({
    mutationFn: updateTrackedJob,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['trackedJobs'] });
    },
    onError: error => console.error(error)
  });

  const {
    data: trackedJobData,
    isLoading: isTrackedJobLoading,
    isError: isTrackedJobError,
    refetch
  } = useQuery({
    ...getTrackedJobByIdOptions,
    queryKey: ['trackedJobId', jobId],
    enabled: !!jobId
  });

  const { data, isLoading } = useQuery({
    ...getJobRoleByIdOptions,
    queryKey: ['jobRole', jobId],
    enabled: !!jobId
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: generateCoverLetter,
    onError: error => console.log('error', error),
    onSuccess: data => {
      setCoverLetterText(data.cover_letter.paragraphs);

      if (isInitialCoverLetter) {
        setIsInitialCoverLetter(false);
      }

      toast.custom(
        id => (
          <GeneratedWithPoppyAlert
            toastId={id}
            onGenerateAgain={() => {
              const values = coverLetterForm.getValues();
              generateCoverLetterMutation.mutate({
                job_role_id: jobId,
                props: {
                  ...getReducedTopics(values.topics)
                }
              });
            }}
          />
        ),
        {
          duration: Infinity,
          position: 'bottom-center'
        }
      );
    }
  });

  const handleToneChange = (values: ToneValues, pos: TonePosition) => {
    console.log(values);

    setToneValues(values);
    setPosition(pos);
  };

  const getLastCompletedStage = (stages: { [key: string]: boolean }) => {
    const completedStages = Object.entries(stages)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    return completedStages[
      completedStages.length - 1
    ]?.toLowerCase() as JobStage;
  };

  useEffect(() => {
    if (debouncedContent !== '' && debouncedContent !== trackedJobData?.notes) {
      updateTrackedJobMutation.mutate({
        job_id: jobId,
        notes: debouncedContent
      });
    }
  }, [jobId, debouncedContent]);

  useEffect(() => {
    if (trackedJobData) {
      const lastCompletedStage = getLastCompletedStage(trackedJobData?.stage);
      setJobStatus(lastCompletedStage);
    }
  }, [trackedJobData]);

  useEffect(() => {
    if (toneValues) {
      coverLetterForm.setValue('tone', toneValues);
    }
  }, [toneValues]);

  const onSelectReaction = (reaction: Reaction) => {
    updateTrackedJobMutation.mutate({
      job_id: jobId,
      reaction: reaction
    });
  };

  const onClickFavorite = () => {
    updateTrackedJobMutation.mutate({
      job_id: jobId,
      is_favourite: !trackedJobData?.is_favourite
    });
  };

  const onAddInterview = () => {
    if (!trackedJobData) return;
    const stages = trackedJobData.stage;
    const stageArr = Object.keys(stages);

    const stagesThatHaveTheWordInterviewInThem = stageArr.filter(stage =>
      stage?.toLowerCase()?.includes('interview')
    );

    const getHighestInterviewStage = stagesThatHaveTheWordInterviewInThem
      .map(stage => {
        const stageNum = stage.split('-')[1];
        return parseInt(stageNum);
      })
      .sort((a, b) => b - a)[0];

    const newStage = `interview-${getHighestInterviewStage + 1}`;

    const newStages = {
      ...stages,
      [newStage]: false
    };

    updateTrackedJobMutation.mutate({
      job_id: jobId,
      stage: newStages
    });

    console.log(newStages);
  };

  const onStatusChange = (status: string) => {
    const stages = trackedJobData?.stage;
    const stageArr = Object.keys(stages!);

    const trueStages = stageArr.slice(0, stageArr.indexOf(status) + 1);
    const newStages = stageArr.reduce(
      (acc, stage) => {
        acc[stage] = trueStages.includes(stage);
        return acc;
      },
      {} as Record<string, boolean>
    );

    console.log(newStages);

    updateTrackedJobMutation.mutate({
      job_id: jobId,
      stage: newStages
    });
  };

  const getStatus = (status: string) => {
    if (status.startsWith('interview-')) {
      return 'interview' as JobStage;
    }

    return status as JobStage;
  };

  const getEditorStage = () => {
    return getStatus(getLastCompletedStage(trackedJobData?.stage || {}));
  };

  const toggleStyle = (value: string, index: number) => {
    coverLetterForm.setValue('style', value as 'classic' | 'simple' | 'modern');
  };

  const onAddTopic = (formData: TopicSchema) => {
    const isFormValid = topicForm.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    console.log(formData);

    coverLetterForm.setValue('topics', [
      ...coverLetterForm.getValues('topics'),
      formData
    ]);

    setTopics([...topics, formData]);
    topicForm.reset();
    setOpen(false);
  };

  const onGenerate = (formData: GenerateCoverLetterSchema) => {
    setCoverLetterText('');

    const isFormValid = coverLetterForm.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    // const reducedTones = getReducedTones(formData.tone);
    const reducedTopics = getReducedTopics(formData.topics);

    const payload = {
      //   ...reducedTones,
      ...reducedTopics
    };

    generateCoverLetterMutation.mutate({
      job_role_id: data?.id as string,
      props: payload
    });
  };

  const handleExportFile = () => {
    reactToPrintFn();
  };

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
  };

  const editTopic = (index: number, number: number[]) => {
    const newTopics = [...topics];
    newTopics[index].range = number[0];

    setTopics(newTopics);
    coverLetterForm.setValue('topics', newTopics);
  };

  const deleteTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);

    setTopics(newTopics);
    coverLetterForm.setValue('topics', newTopics);
  };

  if (isLoading || isTrackedJobLoading) return <Loader />;

  return (
    <NavigationPageWrapper
      onClickCustom={onLogout}
      items={navigationItems}
      profile={sessionStorage.getItem('profilePhoto') || ''}
    >
      <Tabs
        defaultValue="notes"
        className="flex"
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as 'notes' | 'cover-letter')
        }
      >
        <div className="flex flex-col w-full items-start bg-neutral-n-100">
          <div className="flex justify-between w-full px-12 py-6 items-center gap-2">
            <div className="flex flex-col items-start gap-3 flex-1">
              <Button
                size="default"
                label="Your Jobs"
                variant="secondary"
                leftIcon="ArrowLeft_bold"
                onClick={() => (window.location.href = '/your-jobs')}
              />

              <div className="mb-4 flex flex-col gap-1">
                <Typography variant="heading-md">{data?.title}</Typography>
                <Typography variant="body" className="ml-1">
                  {data?.company_name}
                </Typography>
              </div>
              <TabsList className="gap-2">
                <TabsTrigger
                  value="notes"
                  className="bg-neutral-n-200 text-neutral-n-500"
                >
                  <Typography variant="caption-strong" className="">
                    Notes
                  </Typography>
                </TabsTrigger>

                <TabsTrigger
                  value="cover-letter"
                  className="gap-2 bg-neutral-n-200 text-neutral-n-500"
                >
                  <Image
                    width={18}
                    height={18}
                    alt="Poppy Logo"
                    src="/images/poppy-logo.svg"
                  />
                  <Typography variant="caption-strong">Cover Letter</Typography>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent
            value="notes"
            className="w-full py-6 px-12 gap-6 bg-neutral-n-100 min-h-[648px]"
          >
            <Editor
              stage={getEditorStage()}
              onUpdate={(c: string) => setEditorContent(c)}
              content={editorContent || trackedJobData?.notes || ''}
            />
          </TabsContent>

          <TabsContent
            value="cover-letter"
            className="w-full py-6 px-12 gap-6 bg-neutral-n-100 min-h-[648px]"
          >
            <div ref={contentRef} className="p-8 printContent">
              <HtmlRenderer html={coverLetterText} />
            </div>

            {isInitialCoverLetter ? (
              //   <GenerateWithPoppy
              //     isLoading={generateCoverLetterMutation.isPending}
              //     onClick={() => onGenerate(coverLetterForm.getValues())}
              //   />
              <CoverLetterCards
                isLoading={generateCoverLetterMutation.isPending}
                onClick={() => onGenerate(coverLetterForm.getValues())}
              />
            ) : (
              <>
                {generateCoverLetterMutation?.isPending ? (
                  <div className="flex items-center justify-center gap-2 w-full h-[400px]">
                    <Typography
                      variant="heading-sm"
                      className="text-neutral-n-500"
                    >
                      Generating...
                    </Typography>
                    <PhosphorIcon
                      size={48}
                      iconVariant="CircleNotch_regular"
                      className="fill-neutral-n-500 animate-spin"
                    />
                  </div>
                ) : (
                  <Editor
                    content={coverLetterText || ''}
                    editorClassName="editor-content-font"
                    onUpdate={(c: string) => console.log(c)}
                  />
                )}
              </>
            )}
          </TabsContent>
        </div>

        <TabsContent
          value="notes"
          className="flex flex-col items-start min-w-[30%] data-[state=inactive]:hidden"
        >
          <div className="flex flex-col items-start self-stretch bg-white gap-2">
            <div className="flex items-center gap-2 self-stretch px-4 py-4">
              <Typography variant="heading-sm">Properties</Typography>

              <Button
                size="default"
                variant="secondary"
                onClick={onClickFavorite}
                label={trackedJobData?.is_favourite ? 'Favorited' : 'Favorite'}
                leftIcon={
                  trackedJobData?.is_favourite ? 'Heart_fill' : 'Heart_regular'
                }
                className={`ml-auto hover:bg-red-r-200 hover:border-red-r-200 ${
                  trackedJobData?.is_favourite
                    ? 'text-red-r-500 bg-red-r-100'
                    : 'text-red-r-500 bg-white'
                }`}
              />
            </div>

            <hr className="w-full border-neutral-n-200 -mt-2" />

            <div className="flex items-center justify-between gap-2 w-full px-4 py-4">
              <Typography variant="caption" className="ml-0.5">
                Your Reaction:
              </Typography>

              <EmojiPicker
                popup={false}
                onSelect={onSelectReaction}
                pickedEmoji={trackedJobData?.reaction as Reaction}
              />
            </div>

            <hr className="w-full border-neutral-n-200 -mt-2" />

            <div className="flex flex-col w-full px-4 py-4 gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhosphorIcon
                    iconVariant="ArrowsDownUp_regular"
                    className="fill-neutral-n-500"
                  />
                  <Typography variant="body-strong">Migrate To</Typography>
                </div>

                {/* <Button
                size="default"
                variant="tertiary"
                label="Add Interview"
                onClick={onAddInterview}
                leftIcon="PlusCircle_fill"
              /> */}
              </div>

              <MigrateTo
                key={jobStatus}
                dropdown={false}
                jobId={data?.id!}
                initialStage={jobStatus}
                onStatusChange={status => onStatusChange(status)}
                dynamicJobStatuses={Object.keys(trackedJobData?.stage || {})}
              />
            </div>

            <hr className="w-full border-neutral-n-200 -mt-2" />
          </div>

          <div className="flex flex-col items-start self-stretch bg-white px-4 py-4">
            <div className="flex items-center gap-2 self-stretch mb-4 mt-2">
              <div className="flex items-center gap-2">
                <PhosphorIcon
                  iconVariant="Briefcase_fill"
                  className="fill-neutral-n-500"
                />
                <Typography variant="body-strong">Overview</Typography>
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 self-stretch">
              <div className="flex flex-col items-start gap-2 self-stretch">
                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Pathway</Typography>
                  </div>
                  <PathwayTag
                    variant={
                      data?.pathway?.toLowerCase() as keyof typeof industryTypes
                    }
                  />
                </div>

                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Salary</Typography>
                  </div>
                  <Tag
                    label={hasSalary(
                      data?.minimum_pay ?? null,
                      data?.maximum_pay ?? null
                    )}
                  />
                </div>
                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Education</Typography>
                  </div>
                  <Tag label={hasEducation(data?.education_level || '')} />
                </div>
                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Level</Typography>
                  </div>
                  <Tag label={data?.level_of_experience}></Tag>
                </div>
                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Location</Typography>
                  </div>
                  <div className="flex gap-2">
                    <Tag label={data?.city}></Tag>
                    <Tag label={data?.state}></Tag>
                  </div>
                </div>
                <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                  <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                    <Typography variant="caption">Workplace</Typography>
                  </div>
                  <Tag label={data?.workplace_type}></Tag>
                </div>

                <Button
                  size="default"
                  className="-ml-1"
                  variant="secondary"
                  label="View Job Description"
                  onClick={() => (window.location.href = `/jobs/${data?.id}`)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {coverLetterText && (
          <TabsContent
            value="cover-letter"
            className="flex flex-col items-start min-w-[30%] max-w-[420px] data-[state=inactive]:hidden"
          >
            <div className="flex flex-col items-start self-stretch bg-white gap-2 h-full">
              <div className="flex items-center gap-2 self-stretch px-4 py-4">
                <Typography variant="heading-sm">Properties</Typography>

                <Button
                  size="default"
                  label={'Save It'}
                  onClick={() => {}}
                  variant="tertiary"
                  className={`ml-auto`}
                />
              </div>

              <hr className="w-full border-neutral-n-200 -mt-2" />

              <div className="flex flex-col gap-2 w-full px-4 py-4">
                <Typography variant="body-strong" className="ml-0.5">
                  Select a Style
                </Typography>

                <div className="w-full">
                  <SegmentedControl
                    className="min-w-full max-w-full"
                    name={'style'}
                    callback={toggleStyle}
                    defaultIndex={initialToggle}
                    segments={[
                      {
                        ref: classicRef,
                        label: 'Classic',
                        value: 'classic'
                      },
                      {
                        label: 'Modern',
                        value: 'modern',
                        ref: modernRef
                      },
                      {
                        label: 'Simple',
                        value: 'simple',
                        ref: simpleRef
                      }
                    ]}
                  />
                </div>

                {coverLetterForm.formState.errors.style && (
                  <ContextualAlert
                    variant="critical"
                    label={coverLetterForm.formState.errors.style.message!}
                  />
                )}
              </div>

              {/* <hr className="w-full border-neutral-n-200" />

            <div className="flex flex-col gap-2 w-full px-4 py-4">
              <TonePicker
                initialPosition={position}
                onToneChange={handleToneChange}
              />
            </div> */}

              <hr className="w-full border-neutral-n-200" />

              <div className="flex flex-col gap-2 w-full px-4 py-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Typography variant="body-strong">Topics</Typography>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="default"
                        label="Add Tone"
                        variant="tertiary"
                        leftIcon="Plus_regular"
                      />
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[540px] max-h-[98%] overflow-auto !z-[1000003]">
                      <DialogHeader className="mt-20">
                        <DialogTitle>
                          <Typography
                            variant="heading-md"
                            className="text-primary-g-900"
                          >
                            Add topics or tones to your cover letter
                          </Typography>
                        </DialogTitle>

                        {hasErrors && (
                          <Alert
                            variant="critical"
                            onClose={() => setHasErrors(false)}
                            label={'Please fill in all required fields'}
                          />
                        )}
                      </DialogHeader>

                      <Form {...topicForm}>
                        <form
                          noValidate
                          onSubmit={(e?: BaseSyntheticEvent) =>
                            e?.preventDefault()
                          }
                        >
                          <div
                            id="experienceInfo"
                            className="flex flex-col gap-4 mt-4"
                          >
                            <div className="flex flex-col gap-4 mb-4">
                              <TextInput
                                type="text"
                                fieldName="topic_name"
                                placeholder="Topic/Tone Name"
                                rules={{
                                  required: 'Topic/Tone name is required'
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center gap-2">
                                <Typography
                                  variant="body"
                                  className="-mb-2 text-neutral-n-700"
                                >
                                  Select Range
                                </Typography>

                                <Typography
                                  variant="caption"
                                  className="text-neutral-n-600"
                                >
                                  {topicForm.watch('range')}%
                                </Typography>
                              </div>

                              <Slider
                                step={1}
                                max={100}
                                defaultValue={[50]}
                                onChange={(e: BaseSyntheticEvent) => {
                                  topicForm.setValue('range', e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </form>
                      </Form>

                      <DialogFooter className="sm:justify-end mt-8">
                        <DialogClose asChild ref={buttonRef}>
                          <Button
                            type="button"
                            label="Cancel"
                            variant="tertiary"
                          />
                        </DialogClose>

                        <Button
                          type="button"
                          variant="primary"
                          label="Add Topic/Tone"
                          onClick={() => onAddTopic(topicForm.getValues())}
                          disabled={
                            !topicForm.formState.isDirty ||
                            topicForm.formState.isSubmitting
                          }
                        />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="w-full flex flex-col gap-y-8">
                  {topics.length > 0 ? (
                    topics.map((topic, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Typography variant="caption">
                              {topic.topic_name}
                            </Typography>

                            <span onClick={() => deleteTopic(index)}>
                              <PhosphorIcon
                                size={18}
                                iconVariant="Trash_regular"
                                className="transition-colors duration-200 ease-in-out fill-primary-g-800 cursor-pointer hover:fill-red-r-500"
                              />
                            </span>
                          </div>

                          <Typography
                            variant="caption"
                            className="text-neutral-n-600"
                          >
                            {topic.range}%
                          </Typography>
                        </div>

                        <Slider
                          step={1}
                          max={100}
                          value={[topic.range]}
                          defaultValue={[topic.range]}
                          onValueChange={number => editTopic(index, number)}
                        />
                      </div>
                    ))
                  ) : (
                    <Typography
                      variant="caption"
                      className="text-center  flex justify-center items-center"
                    >
                      Click add topics to add key areas you want to emphasize in
                      your cover letter or keep on writing and let Poppy find
                      topics for you.
                    </Typography>
                  )}
                </div>
              </div>

              {coverLetterText && (
                <>
                  <hr className="w-full border-neutral-n-200" />
                  <div className="flex flex-col items-start self-stretch bg-white px-4 py-2 gap-y-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Typography variant="body-strong">
                        Export Cover Letter
                      </Typography>
                    </div>

                    {/* <Form {...exportCoverLetterForm}>
                  <form
                    noValidate
                    className="w-full"
                    onSubmit={(e?: BaseSyntheticEvent) => e?.preventDefault()}
                  >
                    <Dropdown
                      fieldName="gender"
                      placeholder="File type"
                      options={['pdf', 'docx']}
                      rules={{ required: 'File type is required' }}
                    />
                  </form>
                </Form> */}

                    <Button
                      size="default"
                      className="w-full"
                      variant="secondary"
                      onClick={handleExportFile}
                      label="Export File as PDF"
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className={`${(activeTab === 'notes' || open) && 'hidden'}`}>
        <Toaster />
      </div>
    </NavigationPageWrapper>
  );
}
