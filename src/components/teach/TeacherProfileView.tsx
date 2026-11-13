"use client";

import { useRef, useState } from "react";
import { ExternalLink, ImageUp, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Field";
import { SocialLinks, TestimonialCard } from "@/components/teacher/TeacherExtras";
import { ProfileForm } from "@/components/account/ProfileForm";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { SOCIALS } from "@/config/socials";
import { getTeacherById } from "@/lib/catalog/repository";
import { useTeacherProfile } from "@/lib/hooks/use-store";
import { SOCIAL_PLATFORMS, type PublicUser, type SocialPlatform } from "@/lib/store/schema";
import {
  MAX_TESTIMONIALS, addTestimonial, preparePhoto, profileKey, removePhoto, removeTestimonial, savePhoto, saveSocials,
} from "@/lib/services/teacher-profile";
import { toast } from "@/lib/services/toast";
import { getStore } from "@/lib/store/app-store";

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 md:grid md:grid-cols-[280px_1fr] md:gap-12">
      <div className="mb-6 md:mb-0">
        <h2 className="text-title font-semibold">{title}</h2>
        <p className="mt-1 text-body text-ink-soft">{description}</p>
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}

/** Where teachers edit what buyers see: photo, bio, social media and client reviews. */
export function TeacherProfileView() {
  const user = useRequiredUser();
  const catalogTeacher = user.teacherId ? getTeacherById(user.teacherId) : undefined;

  return (
    <>
      <PageHeader
        title="Your teacher profile"
        subtitle="This is what people see before they buy your course."
        action={catalogTeacher && (
          <Button href={`/teachers/${catalogTeacher.slug}`} variant="outline">
            <ExternalLink className="h-4 w-4" /> See your public profile
          </Button>
        )}
      />
      {!catalogTeacher && (
        <p className="mt-6 rounded-2xl bg-canvas p-4 text-body">Your public profile goes live when your first course is approved. Set it up now so it&rsquo;s ready.</p>
      )}
      <div className="mt-10">
        <Panel title="Profile photo" description="A clear, friendly photo of your face. Learners trust teachers they can see.">
          <PhotoUpload user={user} />
        </Panel>
        <Panel title="About you" description="Your name, country and a short story about your craft.">
          <ProfileForm user={user} bioFallback={catalogTeacher?.bio} />
        </Panel>
        <Panel title="Social media" description="Show your work on Instagram, TikTok and more. Learners can look you up before buying.">
          <SocialsForm user={user} />
        </Panel>
        <Panel title="Reviews from past clients" description={`Add up to ${MAX_TESTIMONIALS} reviews from people you've sewn for, styled or taught outside Sanaa. They're shown as shared by you.`}>
          <Testimonials user={user} />
        </Panel>
      </div>
    </>
  );
}

function PhotoUpload({ user }: { user: PublicUser }) {
  const profile = useTeacherProfile(profileKey(user));
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    const prepared = await preparePhoto(file);
    setBusy(false);
    if (!prepared.ok) return setError(prepared.error);
    const saved = savePhoto(user, prepared.data);
    if (!saved.ok) return setError(saved.error);
    setError("");
    toast("Photo saved", { tone: "success" });
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar name={user.name} photo={profile?.photo} size="2xl" />
      <div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="dark" loading={busy} onClick={() => input.current?.click()}>
            <ImageUp className="h-4 w-4" /> {profile?.photo ? "Change photo" : "Upload photo"}
          </Button>
          {profile?.photo && (
            <Button type="button" variant="ghost" onClick={() => { removePhoto(user); toast("Photo removed"); }}>Remove</Button>
          )}
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-hidden onChange={onFile} />
        {error ? (
          <p role="alert" className="mt-2 text-caption font-medium text-ember">{error}</p>
        ) : (
          <p className="mt-2 text-caption text-ink-soft">JPG, PNG or WebP, up to 10 MB. We crop it to a square.</p>
        )}
      </div>
    </div>
  );
}

const PLACEHOLDER: Record<SocialPlatform, string> = { instagram: "@yourname", tiktok: "@yourname", youtube: "@yourchannel", facebook: "yourpage", x: "@yourname" };

function toForm(socials: Partial<Record<SocialPlatform, string>>): Record<SocialPlatform, string> {
  return Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, socials[p] ? (p === "facebook" ? "" : "@") + socials[p] : ""])) as Record<SocialPlatform, string>;
}

function SocialsForm({ user }: { user: PublicUser }) {
  const profile = useTeacherProfile(profileKey(user));
  const [form, setForm] = useState(() => toForm(profile?.socials ?? {}));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = saveSocials(user, form);
    if (!res.ok) return setErrors(res.fields ?? {});
    setErrors({});
    // Show the cleaned-up handles, e.g. a pasted link becomes @name.
    const saved = getStore().teacherProfiles[profileKey(user)]?.socials;
    if (saved) setForm(toForm(saved));
    toast("Social media saved", { tone: "success" });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {SOCIAL_PLATFORMS.map((p) => (
        <TextField
          key={p}
          label={SOCIALS[p].label}
          value={form[p]}
          placeholder={PLACEHOLDER[p]}
          onChange={(e) => setForm({ ...form, [p]: e.target.value })}
          error={errors[p]}
          maxLength={200}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      ))}
      <p className="text-caption text-ink-soft">Paste your username or profile link. Leave a box empty to hide it. To keep payments safe, phone numbers and payment links aren&rsquo;t shown.</p>
      {profile && <SocialLinks socials={profile.socials} />}
      <Button type="submit" variant="dark">Save social media</Button>
    </form>
  );
}

const EMPTY = { author: "", context: "", body: "", confirm: false };

function Testimonials({ user }: { user: PublicUser }) {
  const profile = useTeacherProfile(profileKey(user));
  const list = profile?.testimonials ?? [];
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const full = list.length >= MAX_TESTIMONIALS;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = addTestimonial(user, form);
    if (!res.ok) return setErrors(res.fields ?? { _form: res.error });
    setErrors({});
    setForm(EMPTY);
    toast("Review added", { tone: "success" });
  }

  return (
    <div className="space-y-8">
      {list.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <li key={t.id}>
              <TestimonialCard t={t}>
                <IconButton label={`Remove review from ${t.author}`} variant="ghost" size="sm" onClick={() => { removeTestimonial(user, t.id); toast("Review removed"); }}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </TestimonialCard>
            </li>
          ))}
        </ul>
      )}
      {full ? (
        <p className="text-body text-ink-soft">You&rsquo;re showing {MAX_TESTIMONIALS} reviews, the most allowed. Remove one to add another.</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <TextField label="Their name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} error={errors.author} maxLength={80} placeholder="e.g. Chioma N." />
          <TextField label="Who they are (optional)" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} error={errors.context} maxLength={80} placeholder="e.g. Bride, Lagos 2025" />
          <TextAreaField label="What they said" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} error={errors.body} maxLength={400} hint={`${form.body.length}/400`} />
          <CheckboxField
            label="This is a real review, and I have the person's permission to share it."
            checked={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.checked })}
            error={errors.confirm}
          />
          {errors._form && <p role="alert" className="text-caption font-medium text-ember">{errors._form}</p>}
          <Button type="submit" variant="dark">Add review</Button>
        </form>
      )}
    </div>
  );
}
