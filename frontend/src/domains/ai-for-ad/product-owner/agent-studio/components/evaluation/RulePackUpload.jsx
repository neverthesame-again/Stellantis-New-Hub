import React, { useEffect, useRef, useState } from 'react';
import { Upload, Copy, Check, FileJson, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { SAMPLE_RULE_PACK, validateRulePack } from './evalUtils';

const SAMPLE_JSON = JSON.stringify(SAMPLE_RULE_PACK, null, 2);

/** Upload a JSON rule pack, validate each entry and add the valid ones via addRules. */
export default function RulePackUpload({ rules, addRules, onToast }) {
  const inputRef = useRef(null);
  const copyTimer = useRef(null);
  const [result, setResult] = useState(null); // { fileName, error?, entries, added }
  const [copied, setCopied] = useState(false);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const ingest = (data, fileName) => {
    const res = validateRulePack(data, rules);
    if (res.error) {
      setResult({ fileName, error: res.error, entries: [], added: 0 });
      onToast(`${fileName}: ${res.error}`, 'error');
      return;
    }
    if (res.valid.length) addRules(res.valid, fileName);
    const rejected = res.entries.length - res.valid.length;
    setResult({ fileName, entries: res.entries, added: res.valid.length });
    onToast(
      `${fileName}: ${res.valid.length} rule${res.valid.length === 1 ? '' : 's'} added${rejected ? ` · ${rejected} rejected` : ''}`,
      res.valid.length ? 'success' : 'error'
    );
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch (err) {
      const msg = `Invalid JSON — ${err.message}`;
      setResult({ fileName: file.name, error: msg, entries: [], added: 0 });
      onToast(`${file.name}: invalid JSON`, 'error');
      return;
    }
    ingest(data, file.name);
  };

  const copySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_JSON);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      onToast('Clipboard not available — select the snippet and copy manually', 'error');
    }
  };

  return (
    <section className="ad-studio-card ad-eval-upload">
      <div className="ad-studio-card-title">
        <h3><FileJson size={13} /> Upload rule pack</h3>
        <span className="ad-studio-badge is-mono">.json</span>
      </div>
      <p className="ad-studio-muted">
        Import program- or supplier-specific gates (e.g. a SOTIF pack for Release 4.2). Each entry needs a
        <code> name</code>, a <code>dimension</code> key and a <code>min</code> between 0 and 100; <code>blocking</code>,
        <code> asil</code>, <code>subDomain</code> and <code>description</code> are optional.
      </p>

      <div className="ad-eval-upload-actions">
        <input ref={inputRef} type="file" accept=".json,application/json" onChange={onFile} className="ad-eval-file-input" aria-label="Rule pack JSON file" />
        <button type="button" className="ad-studio-btn is-primary" onClick={() => inputRef.current?.click()}>
          <Upload size={13} /> Choose JSON file
        </button>
        <button type="button" className="ad-studio-btn is-accent" onClick={() => ingest(SAMPLE_RULE_PACK, 'sample-rule-pack.json')}>
          <Sparkles size={13} /> Apply sample pack
        </button>
      </div>

      {result && (
        <div className={`ad-eval-upload-result ${result.error || !result.added ? 'is-error' : ''}`}>
          <div className="ad-eval-upload-result-head">
            <strong>{result.fileName}</strong>
            {result.error
              ? <span className="ad-studio-badge is-critical">Rejected</span>
              : <span className={`ad-studio-badge ${result.added ? 'is-success' : 'is-critical'}`}>{result.added}/{result.entries.length} added</span>}
          </div>
          {result.error && <p className="ad-eval-upload-error">{result.error}</p>}
          {result.entries.length > 0 && (
            <ul className="ad-eval-upload-entries">
              {result.entries.map((en) => (
                <li key={en.index} className={en.ok ? 'is-ok' : 'is-bad'}>
                  {en.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <div>
                    <span>#{en.index + 1} {en.name}</span>
                    {en.errors.map((er) => <em key={er}>{er}</em>)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="ad-eval-code">
        <div className="ad-eval-code-head">
          <span>sample-rule-pack.json</span>
          <button type="button" className="ad-eval-code-copy" onClick={copySample}>
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre><code>{SAMPLE_JSON}</code></pre>
      </div>
    </section>
  );
}
