import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create コマンドでファイル作成メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx", file_text: "const App = () => <div>Hello</div>" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイルを作成: App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace コマンドでファイル編集メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Button.tsx", old_str: "red", new_str: "blue" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイルを編集: Button.tsx")).toBeDefined();
});

test("str_replace_editor insert コマンドでファイル挿入メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/index.tsx", insert_line: 5, new_str: "import React from 'react'" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイルに挿入: index.tsx")).toBeDefined();
});

test("str_replace_editor view コマンドでファイル表示メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "view", path: "/App.jsx" }}
      state="result"
      result="file content"
    />
  );

  expect(screen.getByText("ファイルを表示: App.jsx")).toBeDefined();
});

test("str_replace_editor undo_edit コマンドで元に戻すメッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("編集を元に戻す: App.jsx")).toBeDefined();
});

test("file_manager rename コマンドでファイル名変更メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイル名を変更: old.jsx → new.jsx")).toBeDefined();
});

test("file_manager delete コマンドでファイル削除メッセージを表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "delete", path: "/temp.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイルを削除: temp.jsx")).toBeDefined();
});

test("未知のツール名はそのまま表示", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      args={{}}
      state="result"
      result="done"
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("完了状態で緑のインジケーターを表示", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("処理中状態でスピナーを表示", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );

  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ネストされたパスからファイル名を正しく抽出", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/components/ui/Button.tsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("ファイルを作成: Button.tsx")).toBeDefined();
});
