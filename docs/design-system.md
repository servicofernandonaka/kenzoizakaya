# Design system — Diário & Laboratório Culinário (Wabi-Sabi / NHK-inspired)

Tokens em `src/index.css` (hex oficiais + canais RGB `--c-*` para o Tailwind). Transições de tema: `duration-300 ease-in-out`.

| Token | Linho (claro) | Sumizumi (escuro) |
|---|---|---|
| `--bg-primary` | `#F9F8F6` | `#121214` |
| `--bg-surface` | `#FFFFFF` | `#1A1A1E` |
| `--border` | `#E5E2DE` | `#2A2A2E` |
| `--text-primary` | `#1C1B1A` | `#F4F4F5` |
| `--text-secondary` | `#55534F` (spec: `#66635F`) | `#A6A6AE` (spec: `#A1A1AA`) |
| `--accent-primary` | `#C82333` | `#E53935` |
| `--accent-subtle` | `#FDF2F2` | `#2D1515` |
| `--accent-ink` (acento como texto) | `#A21C29` | `#F08A87` |
| `--accent-strong` (fundo de botão, texto branco) | `#AD1E2C` | `#AF1A17` |

## Por que há variantes derivadas (WCAG AAA = 7:1)
Com os valores especificados, o contraste ficava abaixo de 7:1: texto secundário (5,63:1 no claro; 6,77:1 sobre a superfície escura), acento como texto (5,28:1 claro; 4,10:1 escuro) e texto branco sobre o acento (5,61:1 claro; 4,23:1 escuro).
Foram derivadas variantes de mesmo matiz que alcançam ≥ 7:1. O acento especificado segue em bordas, anéis, ícones e estados.

## Exceção intencional
Itens e passos **marcados como concluídos** usam `opacity-40 line-through` (pedido explícito): é um estado de baixa ênfase e não atinge 7:1.

## Tipografia
Lora (títulos, serifada) + Figtree (texto, dados e metadados; algarismos tabulares), ambas servidas localmente via `@fontsource` (funcionam offline). Japonês usa as fontes do sistema.

## Verificação
Auditoria automática com axe-core (`wcag2a/aa/aaa`, `best-practice`) em 9 telas × 2 temas e nos estados interativos: sem violações (exceto o estado concluído acima).
