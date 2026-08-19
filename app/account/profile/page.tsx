"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  display_name: string;
  bio: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setFetching(false);
        return;
      }

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url);
      } else {
        // 老用户没有 profile 行，创建一个
        const defaultName = user.email ? user.email.split("@")[0] : "用户";
        const { data: created } = await supabase
          .from("profiles")
          .upsert({ id: user.id, display_name: defaultName })
          .select("display_name, bio, avatar_url")
          .maybeSingle();
        if (created) {
          setProfile(created);
          setDisplayName(created.display_name || "");
          setBio(created.bio || "");
          setAvatarUrl(created.avatar_url);
        } else {
          setProfile({ display_name: defaultName, bio: "", avatar_url: null });
          setDisplayName(defaultName);
        }
      }
      setFetching(false);
    })();
  }, [user]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 限制 2MB
    if (file.size > 2 * 1024 * 1024) {
      setMessage("头像文件不能超过 2MB。");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("");
    setMessageType("");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        setMessage("头像上传失败，请重试。");
        setMessageType("error");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        setMessage("头像上传成功但保存失败，请重试。");
        setMessageType("error");
      } else {
        setAvatarUrl(publicUrl);
        setMessage("头像更新成功！");
        setMessageType("success");
      }
    } catch {
      setMessage("上传过程出错，请重试。");
      setMessageType("error");
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const name = displayName.trim();
    if (name.length < 1 || name.length > 80) {
      setMessage("昵称需要 1-80 个字符。");
      setMessageType("error");
      return;
    }

    if (bio.length > 500) {
      setMessage("简介不能超过 500 个字符。");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: name, bio: bio.trim() })
        .eq("id", user.id);

      if (error) {
        setMessage("保存失败，请重试。");
        setMessageType("error");
      } else {
        setMessage("个人资料已保存！");
        setMessageType("success");
      }
    } catch {
      setMessage("保存过程出错，请重试。");
      setMessageType("error");
    }
    setSaving(false);
  }

  if (loading || fetching) {
    return <p className="form-message">加载中…</p>;
  }

  if (!user) {
    return (
      <>
        <span className="eyebrow">ACCOUNT</span>
        <h1 className="page-title">请先登录</h1>
        <p className="page-lead">
          编辑个人资料需要先登录。<Link href="/login">前往登录</Link>
        </p>
      </>
    );
  }

  const initial = (displayName || user.email || "U")[0].toUpperCase();

  return (
    <>
      <span className="eyebrow">ACCOUNT</span>
      <h1 className="page-title">个人资料</h1>
      <p className="page-lead">
        设置你的昵称和头像，这些信息会显示在你的实战记录和提交的作品中。
      </p>

      {/* 头像区域 */}
      <div className="profile-avatar-section" style={{ display: "flex", alignItems: "center", gap: "20px", margin: "30px 0" }}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="头像"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--line)",
            }}
          />
        ) : (
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: "36px",
              fontWeight: "900",
              color: "#fff",
              background: "linear-gradient(145deg,#8d6eff,#4f2dc9)",
            }}
          >
            {initial}
          </div>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="button small ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "上传中…" : "更换头像"}
          </button>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--muted)" }}>
            支持 PNG / JPG / WebP，不超过 2MB
          </p>
        </div>
      </div>

      {/* 资料表单 */}
      <form className="form-card" onSubmit={handleSave}>
        <label>
          昵称
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="你的昵称"
            maxLength={80}
          />
        </label>
        <label>
          简介（可选）
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="一句话介绍自己"
            rows={3}
            maxLength={500}
            style={{ resize: "vertical" }}
          />
        </label>
        <button className="button" type="submit" disabled={saving}>
          {saving ? "保存中…" : "保存资料"}
        </button>
        {message && (
          <p
            className="form-message"
            style={{ color: messageType === "success" ? "#2d8060" : "#d33" }}
          >
            {message}
          </p>
        )}
      </form>
    </>
  );
}
