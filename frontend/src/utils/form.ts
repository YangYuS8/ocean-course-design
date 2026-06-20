/**
 * 将 HTML 表单转换为普通对象。
 *
 * FormData 会读取表单中所有带 name 属性的输入框；Object.fromEntries 再把它变成
 * { 字段名: 字段值 } 的对象，方便直接提交给 api.ts。
 */
export function formToObject(form: HTMLFormElement): Record<string, FormDataEntryValue> {
  return Object.fromEntries(new FormData(form).entries())
}
