---
title: 一张表看懂 2026 年主流大模型的架构选择
description: 从 Kimi K2.5 到 DeepSeek V4，我把 27 个主流开源模型的 FFN、注意力、归一化、位置编码方案整理成一张对比表；每个模型条目附主要公开来源，相关技术另列论文和核对说明。
pubDate: 2026-09-06
tags: [人工智能, LLM, 模型架构, 论文笔记]
updatedDate: 2026-09-06
---

今年 1 月到 4 月，开源大模型迎来一波密集发布：Kimi K2.5、Qwen3.5、DeepSeek V4、GLM-5、Gemma 4、Nemotron 3，二十多个模型接力出场。各家架构说明里的关键词越来越像，翻来覆去就是 RMSNorm、RoPE、GQA、MoE 这几样。本文把 27 个模型的模块选型汇总到同一张表，并按模块说明技术方案；模型条目链接主要公开来源，相关技术另列论文。

核对说明：表格优先采用官方技术报告、模型卡和配置文件；来源列同时标明资料类型。官方资料未披露的字段不据此推断。DeepSeek V4-Pro 与 V4-Flash 的逐层注意力配置以官方技术报告为准，具体差异见表格脚注。

配图说明：文中架构图除特别标注外，取自 Sebastian Raschka 的[《The Big LLM Architecture Comparison》](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison)和各模型论文，版权归原作者。表格数据逐行引用主要公开来源；可取得官方技术报告和配置文件的条目已做交叉核对。

![2025-2026 主流开源模型架构总览](./llm-architecture-2026/arch-family.webp)

:::caption
Raschka 整理的架构分支图。左上是标准 Transformer 系，右下的 hybrid 模型们是 2026 年的新势力。
:::

## 汇总大表

列的含义先交代一下：FFN 列的 Sparse 指 MoE（每个 token 只激活部分专家）、Dense 指稠密前馈；归一化列合并了 Pre-Norm / Post-Norm / Attention 内部的 Norm 三个位置；Attention 列按「主要机制 + 辅助机制」写，比例标在括号里；残差列中 RC 指普通残差连接，mHC 指流形约束超连接。编号从 0 开始，只收录 2026 年 1 月之后发布的模型，更早的不在本文统计范围内。

| #   | 模型                       | 发布日期   | 上下文 | 参数（总/激活） | 归一化                          | 位置编码    | Attention                  | 残差 | FFN    | 激活函数 | 主要来源                                                                 |
| --- | -------------------------- | ---------- | ------ | --------------- | ------------------------------- | ----------- | -------------------------- | ---- | ------ | -------- | ------------------------------------------------------------------------ |
| 0   | Kimi K2.5 (1T)             | 2026/01/27 | 256K   | 1T / 32B        | RMSNorm (Pre)                   | RoPE        | MLA                        | RC   | Sparse | SiLU     | [arXiv:2602.02276](https://arxiv.org/abs/2602.02276)                     |
| 1   | Arcee Trinity Large (400B) | 2026/01/27 | 512K   | 400B / 13B      | RMSNorm (Pre+Post) + QK-RMSNorm | RoPE+NoPE   | GQA + SWA (3:1)            | RC   | Sparse | SiLU     | [GitHub 技术报告](https://github.com/arcee-ai/trinity-large-tech-report) |
| 2   | Step 3.5 Flash (196B)      | 2026/02/01 | 262K   | 196B / 11B      | RMSNorm (Pre)                   | RoPE        | GQA + SWA (3:1)            | RC   | Sparse | SiLU     | [arXiv:2602.10604](https://arxiv.org/abs/2602.10604)                     |
| 3   | Nanbeige 4.1 (3B)          | 2026/02/10 | 262K   | 3B / 3B         | RMSNorm (Pre)                   | RoPE        | GQA                        | RC   | Dense  | SiLU     | [arXiv:2602.13367](https://arxiv.org/abs/2602.13367)                     |
| 4   | GLM-5 (744B)               | 2026/02/11 | 203K   | 744B / 40B      | RMSNorm (Pre)                   | RoPE        | MLA + DSA                  | RC   | Sparse | SiLU     | [arXiv:2602.15763](https://arxiv.org/abs/2602.15763)                     |
| 5   | MiniMax-M2.5 (230B)        | 2026/02/12 | 197K   | 230B / 10B      | RMSNorm (Pre) + QK-RMSNorm      | RoPE        | GQA（全注意力）            | RC   | Sparse | SiLU     | [arXiv:2605.26494](https://arxiv.org/abs/2605.26494)                     |
| 6   | Tiny Aya (3.35B)           | 2026/02/13 | 8K     | 3.35B / 3.35B   | LayerNorm                       | RoPE+NoPE   | GQA + SWA (3:1)            | RC   | Dense  | SiLU     | [arXiv:2603.11510](https://arxiv.org/abs/2603.11510)                     |
| 7   | Ling 2.5 (1T)              | 2026/02/15 | 256K   | 1T / 63B        | RMSNorm (Pre)                   | RoPE        | MLA + LightningAttn        | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/inclusionAI/Ling-2.5-1T)              |
| 8   | Qwen3.5 (397B)             | 2026/02/16 | 262K   | 397B / 17B      | RMSNorm (Pre)                   | RoPE        | GatedAttn + DeltaNet (3:1) | RC   | Sparse | SiLU     | [HF 配置](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)                 |
| 9   | Sarvam (105B)              | 2026/03/03 | 131K   | 105B / 10.3B    | RMSNorm (Pre) + KV-LayerNorm    | RoPE+NoPE   | MLA                        | RC   | Sparse | SiLU     | [官方博客](https://www.sarvam.ai/blogs/sarvam-30b-105b)                  |
| 10  | Sarvam (30B)               | 2026/03/03 | 131K   | 30B / 2.4B      | RMSNorm (Pre) + QK-RMSNorm      | RoPE        | GQA                        | RC   | Sparse | SiLU     | [官方博客](https://www.sarvam.ai/blogs/sarvam-30b-105b)                  |
| 11  | Nemotron 3 Super (120B)    | 2026/03/11 | 1M     | 120B / 12B      | RMSNorm (Post)                  | RoPE        | GQA + Mamba-2              | RC   | Sparse | SiLU     | [arXiv:2604.12374](https://arxiv.org/abs/2604.12374)                     |
| 12  | Mistral Small 4 (119B)     | 2026/03/16 | 256K   | 119B / 6.63B    | RMSNorm (Pre)                   | RoPE        | MLA                        | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603)  |
| 13  | Nemotron 3 Nano (4B)       | 2026/03/16 | 262K   | 4B / 4B         | RMSNorm (Post)                  | RoPE        | GQA + Mamba-2              | RC   | Dense  | SiLU     | [HF 博客](https://huggingface.co/blog/nvidia/nemotron-3-nano-4b)         |
| 14  | MiniMax M2.7 (230B)        | 2026/03/18 | 197K   | 230B / 10B      | RMSNorm (Pre) + QK-RMSNorm      | RoPE        | GQA（全注意力）            | RC   | Sparse | SiLU     | [官方公告](https://www.minimax.io/news)                                  |
| 15  | Gemma 4 (31B)              | 2026/04/02 | 256K   | 30.7B / 30.7B   | RMSNorm (Pre+Post) + QK-RMSNorm | RoPE        | GQA + SWA (5:1)            | RC   | Dense  | GELU     | [HF 模型卡](https://huggingface.co/google/gemma-4-31B)                   |
| 16  | Gemma 4 (26B-A4B)          | 2026/04/02 | 256K   | 25.2B / 3.8B    | RMSNorm (Pre+Post) + QK-RMSNorm | RoPE        | GQA + SWA (5:1)            | RC   | Sparse | GELU     | [HF 模型卡](https://huggingface.co/google/gemma-4-31B)                   |
| 17  | Gemma 4 (E4B)              | 2026/04/02 | 128K   | 8B / (4.5B)     | RMSNorm (Pre+Post) + QK-RMSNorm | RoPE        | GQA + SWA                  | RC   | Dense  | GELU     | [HF 模型卡](https://huggingface.co/google/gemma-4-31B)                   |
| 18  | Gemma 4 (E2B)              | 2026/04/02 | 128K   | 5.1B / (2.3B)   | RMSNorm (Pre+Post) + QK-RMSNorm | RoPE        | GQA + SWA                  | RC   | Dense  | GELU     | [HF 模型卡](https://huggingface.co/google/gemma-4-31B)                   |
| 19  | GLM-5.1 (744B)             | 2026/04/07 | 203K   | 744B / 40B      | RMSNorm (Pre)                   | RoPE        | MLA + DSA                  | RC   | Sparse | SiLU     | [GLM-5 仓库](https://github.com/zai-org/GLM-5)                           |
| 20  | Qwen3.6 (35B-A3B)          | 2026/04/15 | 262K   | 35B / 3B        | RMSNorm (Pre)                   | RoPE        | GatedAttn + DeltaNet (3:1) | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)                 |
| 21  | Kimi K2.6 (1T)             | 2026/04/20 | 256K   | 1T / 32B        | RMSNorm (Pre)                   | RoPE        | MLA                        | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/moonshotai/Kimi-K2.6)                 |
| 22  | Xiaomi MiMo-V2.5 (310B)    | 2026/04/22 | 1M     | 310B / 15B      | RMSNorm (Pre)                   | RoPE        | GQA + SWA (5:1)            | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.5)                 |
| 23  | Qwen3.6 (27B)              | 2026/04/22 | 262K   | 27B / 27B       | RMSNorm (Pre)                   | RoPE        | GatedAttn + DeltaNet (3:1) | RC   | Dense  | SiLU     | [官方博客](https://qwen.ai/blog)                                         |
| 24  | Ling 2.6 (1T)              | 2026/04/23 | 262K   | 1T / 63B        | RMSNorm (Pre)                   | RoPE        | MLA + LightningAttn (7:1)  | RC   | Sparse | SiLU     | [HF 模型卡](https://huggingface.co/inclusionAI/Ling-2.6-1T-base)         |
| 25  | DeepSeek V4-Pro (1.6T)     | 2026/04/24 | 1M     | 1.6T / 49B*     | RMSNorm (Pre) + Q/KV-RMSNorm    | p-RoPE+YaRN | CSA + HCA + SWA*           | mHC  | Sparse | SiLU     | [arXiv:2606.19348](https://arxiv.org/abs/2606.19348)                     |
| 26  | DeepSeek V4-Flash (284B)   | 2026/04/24 | 1M     | 284B / 13B      | RMSNorm (Pre) + Q/KV-RMSNorm    | p-RoPE+YaRN | CSA + HCA + SWA*           | mHC  | Sparse | SiLU     | [arXiv:2606.19348](https://arxiv.org/abs/2606.19348)                     |

\* 官方技术报告显示：V4-Pro 的激活参数为 49B，前 2 层使用 HCA，其余层交替使用 CSA 与 HCA；V4-Flash 的前 2 层使用纯 SWA，其余层交替使用 CSA 与 HCA。两种注意力都含 SWA 支路。

从本表的 27 个样本可直接读出：7 个是 Dense（Nanbeige、Tiny Aya、Nemotron 3 Nano 4B、Gemma 4 三档、Qwen3.6 27B），其余 20 个采用 MoE；位置编码均属于 RoPE 系或 RoPE+NoPE 混合，未收录采用绝对位置编码的模型；Gemma 4 的四个条目使用 GELU，其余条目的激活函数标为 SiLU；25 个模型使用 RC，DeepSeek V4 两个模型使用 mHC。样本间最明显的差异集中在 Attention 和归一化两列。

下面按模块拆开讲。

## 归一化：放哪比用什么更要紧

表格里归一化这一列其实叠了三个问题：Norm 用什么（RMSNorm 几乎垄断，只有 Tiny Aya 还在用 LayerNorm）、放在哪（Pre 还是 Post）、以及注意力内部要不要额外加 Norm（QK-Norm）。

### Pre-Norm 与 Post-Norm

2017 年的原版 Transformer 用的是 Post-LN：归一化放在注意力和前馈层之后。GPT-2 及后续许多 LLM 采用 Pre-LN。[Xiong et al. 2020](https://arxiv.org/abs/2002.04745) 讨论了 Pre-LN 在初始化时更稳定的梯度行为；这有助于深层网络训练，但不应视为训练稳定性的唯一原因。Pre-LN 的表达能力与优化特性仍需结合具体模型和训练设置判断。

2025 年 OLMo 2 重新采用了 Post-Norm 变体：把 RMSNorm 放在注意力/FFN 之后，但保留在残差分支内部——不是回到原版 Post-LN，而是「残差内的 Post-Norm」。实验显示，该组合的训练损失更稳定。OLMo 2 技术报告：[arXiv:2501.00656](https://arxiv.org/abs/2501.00656)。

![Pre-Norm、Post-Norm 与 OLMo 2 的变体对比](./llm-architecture-2026/prenorm-postnorm.webp)

:::caption
左：Post-LN（原版 Transformer）；中：Pre-LN（GPT-2 以来的主流）；右：OLMo 2 的 Post-Norm，Norm 回到子层之后但留在残差分支里。
:::

在本表样本中，Nemotron 3 系列采用 Post-Norm，Gemma 4 和 Trinity 采用「两端均归一化」的 Sandwich 路线，其余条目多为标准 Pre-Norm。三种做法并存，说明归一化位置仍需随模型和训练配置评估。

### Sandwich Norm：两头都包

Gemma 系列从 Gemma 2 开始就在注意力模块前后各放一个 RMSNorm。相较于注意力和 FFN，RMSNorm 的计算开销通常较小，因此可以采用这一额外归一化结构。

![Gemma 3 的归一化位置（Gemma 4 沿用）](./llm-architecture-2026/sandwich-norm.webp)

:::caption
Gemma 3/4 的三明治结构：Pre 和 Post 各一个 RMSNorm，注意力内部再加 QK-Norm。
:::

Trinity Large 在此基础上加入 depth-scaled sandwich norm：后置 RMSNorm 的增益按 1/√L 初始化（L 是总层数）。训练早期残差更新较小，随后随训练推进放大。其[技术报告](https://github.com/arcee-ai/trinity-large-tech-report)称，这一初始化有助于缓解 attention sink 并稳定长序列训练。

### QK-Norm：压住注意力的 logits

QK-Norm 就是在 Q 和 K 进 RoPE 之前各加一个 RMSNorm，防止注意力 logits 爆掉。思路来自 2023 年的 [Scaling Vision Transformers](https://arxiv.org/abs/2302.05442)，OLMo 2、Gemma 2/3/4、Sarvam 30B 都在用。

MiniMax M2 系列做了一个变体：per-layer QK-Norm。普通 QK-Norm 的缩放参数跨注意力头共享，MiniMax 给每个头独立的 RMSNorm 参数。代码可见 [vLLM 的实现](https://github.com/vllm-project/vllm/blob/main/vllm/model_executor/models/minimax_m2.py)。

### KV-LayerNorm：Sarvam 的私有配方

Sarvam 105B 在 KV 侧加了 LayerNorm 配合 MLA 使用，这是表格里唯一一例。官方没给太细的消融，[Raschka 的架构画廊](https://sebastianraschka.com/llm-architecture-gallery/)把它标注为 "MLA with KV LayerNorm and NoPE + RoPE"。属于小众但值得记录的设计。

## 位置编码：RoPE 一统天下，然后开始做减法

[RoPE](https://arxiv.org/abs/2104.09864)（旋转位置编码）已经是绝对主流，2026 年的看点是谁在 RoPE 上做减法。

**Partial RoPE（p-RoPE）**：只给一部分维度做旋转。MiniMax 系列只旋转一半的 head 维度，官方报告称这有助于长度外推（[MiniMax-01 技术报告](https://arxiv.org/abs/2501.08313)）；Gemma 4 只给 25% 的频率对加入位置信息，以减少长上下文中的位置噪声。

**NoPE（无位置编码）**：[2023 年的论文](https://arxiv.org/abs/2305.19466)表明，在其研究设置中，因果掩码本身可提供位置信号；省略显式位置编码时，长度外推可能更好。

**RoPE+NoPE 混合**是本表中的一种做法：滑动窗口层用 RoPE，全局注意力层用 NoPE。Trinity Large、Tiny Aya 都采用这一组合。Kimi Linear 的 MLA 全局层也是 NoPE；论文称，这使 MLA 在推理时可按 MQA 运行，并减少长上下文的 RoPE 重调需求。位置编码可以按层配置，而不必全模型统一采用同一种方案。

## 注意力：真正的战场

这一列信息量最大。把 27 个模型的 Attention 列归拢一下，大概是四条路线。

### 路线一：GQA + 滑动窗口，性价比组合

GQA（分组查询注意力，[arXiv:2305.13245](https://arxiv.org/abs/2305.13245)）让多个 Query 头共享一组 KV 头，从而减少 KV cache。原论文与后续模型的消融通常显示，它可在特定设置中保持接近 MHA 的效果；具体差异取决于头数、分组方式和训练配置。

![MHA 与 GQA](./llm-architecture-2026/mha-vs-gqa.webp)

:::caption
MHA（左）每个头独立 KV；GQA（右）分组共享，图中 4 个 Query 头共享 2 组 KV。
:::

滑动窗口注意力（SWA）让每个 token 只看附近固定窗口。纯 SWA 层的 KV cache 可限制在窗口范围内；混合架构若仍保留全局层，整体 KV cache 仍会随序列长度增长，但增长速率更低。思想来自 [Longformer](https://arxiv.org/abs/2004.05150)，Gemma 3 采用 5 层 SWA 配 1 层全局注意力、窗口为 1024 的组合。Gemma 4 延续 5:1 比例，并在全局层复用 key 作为 value（v=k）以进一步减少 KV cache。

![全局注意力 vs 滑动窗口注意力](./llm-architecture-2026/sliding-window.webp)

:::caption
左边全局注意力，每个 token 能看全序列；右边 SWA 只看窗口内。Gemma 3 的消融显示对困惑度影响极小。
:::

本表中采用这条路线的模型包括：Gemma 4（5:1，窗口 1024）、Step 3.5 Flash（3:1，窗口 512）、Trinity（3:1，窗口 4096）、Tiny Aya（3:1）和 MiMo-V2.5（5:1，窗口 128）。Step 3.5 Flash 的[论文](https://arxiv.org/abs/2602.10604)说明，其选择 SWA 而非线性注意力，是因为 SWA 与 MTP 投机解码兼容，且窗口固定后增加 Query 头（64→96）不会增加长上下文开销。

![Gemma 4 与 Gemma 3 的架构对照](./llm-architecture-2026/gemma4-vs-gemma3.webp)

:::caption
Gemma 4（右）和 Gemma 3（左）放在一起几乎看不出区别，最大的变化藏在全局层里：value 直接复用 key，外加 p-RoPE。
:::

### 路线二：MLA，DeepSeek 系的压缩哲学

MLA（多头潜在注意力）由 DeepSeek-V2 引入（[arXiv:2405.04434](https://arxiv.org/abs/2405.04434)）：它将 KV 压缩为低维 latent 向量存入 cache，使用时再投影。GQA 通过减少 KV 副本降低缓存量，MLA 则存储压缩后的 KV。DeepSeek-V2 的消融实验中，MLA 的效果略优于 MHA；这一结果适用于该论文的实验设置。

![MLA 与 MHA 的对比](./llm-architecture-2026/mla-vs-mha.webp)

:::caption
MLA 把 KV 压缩到低维 latent 存储，推理时上采样还原，KV cache 显著缩小。
:::

2026 年，MLA 已被 Kimi K2.5/K2.6、GLM-5/5.1、Ling 2.5/2.6、Mistral Small 4 和 Sarvam 105B 等模型采用。GLM-5 的技术报告显示，在 Muon 优化器下，576 维 latent 的 MLA 表现不如 GQA-8；将 head dim 从 192 提到 256、头数减少 1/3 后（作者称为 MLA-256）才追平。MLA 的效果需要与训练配方和超参数一并评估。

![GLM-5 与 GLM-4.5 的架构对照](./llm-architecture-2026/glm5-vs-glm45.webp)

:::caption
GLM-5（右）相比 GLM-4.5（左）：换上 MLA + DSA，专家从 160 个加到 256 个，层数反而从 92 减到 78。
:::

### 路线三：稀疏注意力，服务超长上下文

GQA/MLA 省的是 KV cache 显存，但注意力的计算量还是 O(n²)。要做百万级上下文，得让每个 token 别看全部历史。

**DSA（DeepSeek Sparse Attention）**：V3.2 引入（[arXiv:2512.02556](https://arxiv.org/abs/2512.02556)）。一个轻量的 lightning indexer 给每个 token 打分，选出少量相关 token 做精细注意力，其余粗略处理。V3.2 之后，GLM-5 直接在继续预训练阶段接入 DSA（他们的消融显示长上下文基准上 DSA 版优于 MLA-only 版），Kimi 的 K2.5 沿用 MLA 不动。

![DeepSeek V3.2 的 MLA + 稀疏注意力](./llm-architecture-2026/dsv32-mla-sparse.webp)

:::caption
V3.2 架构：MLA 基础上加 DSA 稀疏化，V4 的 CSA/HCA 是这条路线的进一步压缩。
:::

**CSA/HCA**：DeepSeek V4（[arXiv:2606.19348](https://arxiv.org/abs/2606.19348)）将稀疏化进一步用于长上下文。CSA（压缩稀疏注意力）和 HCA（重度压缩注意力）在模型层间交替。官方数据中，在 1M token 场景下，V4-Pro 的单 token 推理 FLOPs 为 V3.2 的 27%，KV cache 为 10%；V4-Flash 分别为 10% 和 7%。这体现了将历史信息压缩为 KV 条目的设计方向。

### 路线四：线性注意力回归，混合架构当道

线性注意力具有 O(n) 复杂度。早期方案受准确性和工程实现限制，应用相对有限；2025 年下半年，混合注意力架构重新受到关注。Raschka 的时间线如下：

![线性注意力混合架构时间线](./llm-architecture-2026/linear-attn-timeline.webp)

:::caption
2025 下半年起，MiniMax-M1、Qwen3-Next、DeepSeek V3.2、Kimi Linear 相继转向高效注意力混合。
:::

**Gated DeltaNet**：Qwen3.5/3.6 的选择。DeltaNet 用 delta rule 增量更新一个固定大小的记忆矩阵（可以理解为可学习的快速权重 RNN），Gated 版本加上 Mamba 式的门控衰减（[arXiv:2412.06464](https://arxiv.org/abs/2412.06464)）。纯线性注意力检索精度不够，所以 Qwen 用 3:1 的比例穿插全注意力层——3 层 Gated DeltaNet 配 1 层 Gated Attention。

![Qwen3-Next 的混合注意力结构（Qwen3.5 沿用）](./llm-architecture-2026/qwen-hybrid.webp)

:::caption
3 层 Gated DeltaNet + 1 层 Gated Attention 为一组循环堆叠。Gated Attention 就是普通注意力加输出门。
:::

**Lightning Attention**：MiniMax-01 引入（[arXiv:2501.08313](https://arxiv.org/abs/2501.08313)），Ant Group 的 Ling 系列随后采用。Ling 2.6 以 7:1 的比例混合 MLA 与 Lightning Attention；其[模型卡](https://huggingface.co/inclusionAI/Ling-2.6-1T-base)给出了从 GQA 架构迁移的流程。MiniMax M2 回到全注意力，官方将原因归于线性注意力在推理和多轮对话任务上的精度限制。不同模型的结果表明，混合比例和训练方案会影响这一路线的效果。

**Mamba-2**：NVIDIA Nemotron 3 的选择（[arXiv:2405.21060](https://arxiv.org/abs/2405.21060)）。该系列大多数层采用 Mamba-2，以固定大小状态处理序列；少量注意力层负责全局信息交互。Nano 4B 面向端侧部署，Super 120B 支持 1M 上下文。

![Nemotron 3 Super 的混合架构](./llm-architecture-2026/nemotron3-super.webp)

:::caption
Nemotron 3 Super：Mamba-2 层承载大部分序列建模，稀疏的注意力层做全局锚点，外加 LatentMoE 和 MTP。
:::

Kimi Linear 是这条路线的集大成者：KDA（Kimi Delta Attention，把 Gated DeltaNet 的标量门控细化到每个通道）配 gated MLA，3:1 混合。论文：[arXiv:2510.26692](https://arxiv.org/abs/2510.26692)。表格里没有 Kimi Linear（它发布于 2025 年 10 月，不在本文统计范围内），但理解 Qwen3.5 的 DeltaNet 时值得对照着看。

![Kimi Linear 与 Qwen3-Next 的对照](./llm-architecture-2026/kimi-linear-vs-qwen.webp)

:::caption
同为 3:1 混合，Kimi Linear 把线性层换成 KDA、全注意力层换成 gated MLA，并在 MLA 层用 NoPE。
:::

**Gated Attention** 不是独立路线，而是在全注意力输出进入残差前加入 sigmoid 门，来源是 [arXiv:2505.06708](https://arxiv.org/abs/2505.06708)。它用于缓解 attention sink 和过大的激活值。Qwen 系、Step 3.5 Flash（head-wise 门控）和 Trinity 均采用了相关门控设计。

![Trinity 的注意力门控](./llm-architecture-2026/trinity-gating.webp)

:::caption
Trinity Large 的门控：在缩放点积之后、输出投影之前加逐元素门。
:::

## FFN：MoE 的细粒度化

表格里 Sparse 的 20 个模型全走 MoE 路线，而 MoE 的当代形态基本由 DeepSeekMoE 定义（[arXiv:2401.06066](https://arxiv.org/abs/2401.06066)）：把大专家拆成更多小专家（细粒度），再加一个每个 token 必过的共享专家。小专家提升组合表达的灵活性，共享专家承接通用知识，避免每个路由专家都去学一遍常见模式。

![MoE 模块结构](./llm-architecture-2026/moe-module.webp)

:::caption
MoE 把单个 FFN 换成 N 个专家 FFN + 路由器，每个 token 只激活其中少数几个。
:::

![DeepSeekMoE 的细粒度专家 + 共享专家](./llm-architecture-2026/deepseekmoe-fine-grained.webp)

:::caption
上：传统 MoE，少量大专家；下：DeepSeekMoE，更多小专家加一个共享专家（Always-on）。
:::

本表中的专家配置差异较大：GLM-5 每层 256 个专家（8 路由 + 1 共享），Step 3.5 Flash 为 288 个（top-8），Nemotron 3 Super 为 512 个（top-22）。也有采用较少、大型专家的模型，例如 gpt-oss。专家数量需要结合部署形态和推理吞吐评估，不能单独用于判断优劣。

另一个细节是，部分 MoE 模型在开头绕开常规路由：GLM-5、Step 3.5 Flash 的前 3 层是纯稠密 FFN；DeepSeek V4 的前 3 层使用由 token ID 哈希确定目标专家的 MoE。它们的共同目标是降低早期层引入路由不稳定性的风险，但具体实现并不相同。

## 残差：25 家 RC，2 家 mHC

表格里最扎眼的差异在残差列。25 个模型用最普通的残差连接（RC），DeepSeek V4 系列换成了 mHC（流形约束超连接）。

故事从 [Hyper-Connections](https://arxiv.org/abs/2409.19606)（字节，2024）开始：把单一的残差流加宽成 n 路，层与层之间的连接模式变成可学习的混合矩阵，表达力更强。但 HC 的混合矩阵是自由参数，破坏了残差连接的恒等映射性质，深了之后训练发散。

DeepSeek 的 [mHC](https://arxiv.org/abs/2512.24880)（2025 年 12 月论文）为混合矩阵加入流形约束：采用 Sinkhorn-Knopp 算法迭代 20 轮，将其投影到双随机矩阵空间（Birkhoff 多面体），以恢复恒等映射性质并提升训练稳定性。V4 是 mHC 的首个前沿规模部署，配置为 `hc_mult: 4`（4 路残差流）和 `hc_sinkhorn_iters: 20`。论文将稳定性机制描述为经验性结果，并未给出理论保证。

## 激活函数：SwiGLU 的天下，Gemma 的坚持

在本表样本中，Gemma 4 使用 GELU，其余条目的激活函数标为 SiLU。仅凭激活函数一列无法比较 SwiGLU 与 GeGLU 的整体效果；这类差异还取决于 FFN 结构、训练数据和优化配置。

## 把表格合上看：三条路线

从这 27 个样本的公开架构资料中，可以归纳出三类主要组合：

**压缩注意力路线**：Kimi K2.5/K2.6、GLM-5/5.1、Mistral Small 4、Sarvam 105B 和 Ling 系列采用 MLA 或 MLA 与其他机制的组合。DeepSeek V3.2 在 MLA 基础上采用 DSA；DeepSeek V4 则采用 CSA/HCA。共同目标是降低长上下文的 KV cache 与注意力计算成本，但具体机制并不相同。

**线性注意力混合路线**：Qwen3.5/3.6 的条目均以 3:1 的比例混合 Gated DeltaNet 与 Gated Attention，包括 27B Dense 版本。

**经典注意力组合**：Gemma 4 采用 GQA、5:1 SWA 和 Sandwich Norm。其效果应以明确版本、日期和评测条件的基准为准；本文不以动态排行榜比较不同参数规模模型的能力。Nemotron 的 Mamba 混合与 Nanbeige 的标准 Transformer 配置则表明，架构选择仍有多种可行路径。

在这 27 个样本中，Pre-Norm 与 Post-Norm、MLA 与 GQA、全注意力与线性混合等位置都已有多种成熟选项。这一观察只描述公开的架构组合，不能单独推出基础架构、数据、训练配方或后训练在模型能力中的相对重要性。DeepSeek V4 的 mHC 说明，残差连接仍是值得继续验证的架构方向。

## 参考

汇总用的主要来源：

- Sebastian Raschka, [The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison)（2025-07 发布，2026-04 更新至 Gemma 4）
- Sebastian Raschka, [A Dream of Spring for Open-Weight LLMs](https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight)（2026 年 1-2 月十个架构的补充）
- [Raschka 的 LLM Architecture Gallery](https://sebastianraschka.com/llm-architecture-gallery/)（逐模型架构卡片与 config 对照）

论文与模型资料（按文中出现顺序）：

| 技术                              | 论文                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Transformer / MHA                 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762)                     |
| GQA                               | [arXiv:2305.13245](https://arxiv.org/abs/2305.13245)                              |
| MLA                               | [DeepSeek-V2, arXiv:2405.04434](https://arxiv.org/abs/2405.04434)                 |
| DeepSeekMoE                       | [arXiv:2401.06066](https://arxiv.org/abs/2401.06066)                              |
| Pre-LN / Post-LN                  | [Xiong et al., arXiv:2002.04745](https://arxiv.org/abs/2002.04745)                |
| OLMo 2（Post-Norm 实践）          | [arXiv:2501.00656](https://arxiv.org/abs/2501.00656)                              |
| QK-Norm 来源                      | [Scaling Vision Transformers, arXiv:2302.05442](https://arxiv.org/abs/2302.05442) |
| RMSNorm                           | [arXiv:1910.07467](https://arxiv.org/abs/1910.07467)                              |
| RoPE                              | [RoFormer, arXiv:2104.09864](https://arxiv.org/abs/2104.09864)                    |
| NoPE                              | [arXiv:2305.19466](https://arxiv.org/abs/2305.19466)                              |
| YaRN（长度扩展）                  | [arXiv:2309.00071](https://arxiv.org/abs/2309.00071)                              |
| SWA（长文窗口）                   | [Longformer, arXiv:2004.05150](https://arxiv.org/abs/2004.05150)                  |
| Gemma 3（5:1 SWA 实践）           | [arXiv:2503.19786](https://arxiv.org/abs/2503.19786)                              |
| Gated Attention                   | [arXiv:2505.06708](https://arxiv.org/abs/2505.06708)                              |
| Gated DeltaNet                    | [arXiv:2412.06464](https://arxiv.org/abs/2412.06464)                              |
| Mamba-2                           | [arXiv:2405.21060](https://arxiv.org/abs/2405.21060)                              |
| Kimi Linear / KDA                 | [arXiv:2510.26692](https://arxiv.org/abs/2510.26692)                              |
| MiniMax-01（Lightning Attention） | [arXiv:2501.08313](https://arxiv.org/abs/2501.08313)                              |
| DeepSeek-V3（基线架构）           | [arXiv:2412.19437](https://arxiv.org/abs/2412.19437)                              |
| DeepSeek-V3.2 / DSA               | [arXiv:2512.02556](https://arxiv.org/abs/2512.02556)                              |
| DeepSeek-V4 / CSA-HCA             | [arXiv:2606.19348](https://arxiv.org/abs/2606.19348)                              |
| Hyper-Connections                 | [arXiv:2409.19606](https://arxiv.org/abs/2409.19606)                              |
| mHC                               | [arXiv:2512.24880](https://arxiv.org/abs/2512.24880)                              |
| MTP                               | [arXiv:2404.19737](https://arxiv.org/abs/2404.19737)                              |
| GLM-5                             | [arXiv:2602.15763](https://arxiv.org/abs/2602.15763)                              |
| Kimi K2.5                         | [arXiv:2602.02276](https://arxiv.org/abs/2602.02276)                              |
| Step 3.5 Flash                    | [arXiv:2602.10604](https://arxiv.org/abs/2602.10604)                              |
| Nanbeige 4.1                      | [arXiv:2602.13367](https://arxiv.org/abs/2602.13367)                              |
| Tiny Aya                          | [arXiv:2603.11510](https://arxiv.org/abs/2603.11510)                              |
| MiniMax-M2 系列                   | [arXiv:2605.26494](https://arxiv.org/abs/2605.26494)                              |
| Nemotron 3 Super                  | [arXiv:2604.12374](https://arxiv.org/abs/2604.12374)                              |
| Nemotron 3 Nano 4B                | [HF 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16)         |
