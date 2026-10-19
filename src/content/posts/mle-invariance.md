---
title: '一道题真正理解极大似然估计的本质'
description: '四套系统在 t₀ 时刻三坏一好，怎样估计 θ？先把待估参数从 θ 换成失效概率 p，再用极大似然估计的不变性反解，一道复杂的求导题就变成了 3/4 的简单方程。'
date: 2026-10-19
category: learning
tags: ['概率论', '极大似然估计', '参数估计', '考研数学']
cover: mle
featured: false
---

先看原题。

<figure class="article-figure article-figure-scan">
  <a href="../../images/mle-problem.png" target="_blank" rel="noopener">
    <img src="../../images/mle-problem.png" alt="题目原图：四个元件 A、B、C、D 两两并联后串联，要求系统寿命 T 的分布函数，并用四套系统的定时试验结果估计 θ" width="1329" height="537" decoding="async" />
  </a>
  <figcaption>原题与系统连接图。点击图片可查看大图。</figcaption>
</figure>

题目大意是：元件 A、B 并联，C、D 并联，两个并联模块再串联成一个系统；四个元件的寿命独立同分布于均匀分布 $U(0,\theta)$。第一问求系统寿命 $T$ 的分布函数，第二问用四套系统的定时试验结果估计 $\theta$。

第二问看起来很适合“硬算”：把分布函数代进似然函数，取对数，再对 $\theta$ 求导。真算下去，平方、分式和根号会叠在一起，很容易在中途写错一个符号。

但题目真正想考的并不是这场求导。它想看你能否发现：**我们观察到的不是四个连续的寿命值，而是四次“坏 / 没坏”的伯努利试验。** 把待估参数从 $\theta$ 换成失效概率 $p$，问题会立刻降一个维度。

## 先把第一问做完

设四个元件的寿命为 $X_1,X_2,X_3,X_4$。对单个元件，在 $0\le t<\theta$ 时，

$$
P(X_i>t)=1-\frac{t}{\theta}.
$$

A、B 并联，模块失效当且仅当两个元件都失效。因此并联模块的寿命 $\max(X_1,X_2)$ 的分布函数为

$$
\begin{aligned}
&P\bigl(\max(X_1,X_2)\le t\bigr)\\
&=P(X_1\le t)P(X_2\le t)\\
&=\left(\frac{t}{\theta}\right)^2.
\end{aligned}
$$

它正常工作的概率则是

$$
P\bigl(\max(X_1,X_2)>t\bigr)
=1-\left(\frac{t}{\theta}\right)^2.
$$

整个系统由两个这样的并联模块串联而成，必须两条支路同时存活。由于四个元件的寿命相互独立，

$$
P(T>t)=\left[1-\left(\frac{t}{\theta}\right)^2\right]^2,
$$

其中 $0\le t<\theta$。

于是

$$
F_T(t)=
\begin{cases}
0 & t<0,\\[2pt]
1-\left[1-\frac{t^2}{\theta^2}\right]^2 & 0\le t<\theta,\\[8pt]
1 & t\ge \theta.
\end{cases}
$$

第一问到这里就结束了。真正值得停留的是这个式子的结构：系统在 $t_0$ 之前失效的概率，完全由 $t_0/\theta$ 这一个比值决定。

## 第二问：把 θ 换成 p

试验到 $t_0$ 停止，每套系统只有两种结果：

- 失效：概率为 $p=F_T(t_0)$；
- 仍正常：概率为 $1-p$。

四套系统相互独立，所以“失效”的次数服从二项分布 $B(4,p)$。现在观察到 3 套失效、1 套正常。把这一结果发生的概率写成似然函数：

$$
L(p)=\binom{4}{3}p^3(1-p)=4p^3(1-p).
$$

这里的 $p$ 还不是最终要找的 $\theta$，它只是系统在 $t_0$ 时刻失效的概率。先把这个最基础的二项分布问题解决：

$$
\ln L(p)=\ln 4+3\ln p+\ln(1-p),
$$

$$
\frac{\mathrm{d}\ln L}{\mathrm{d}p}
=\frac{3}{p}-\frac{1}{1-p}.
$$

令导数为零：

$$
\begin{aligned}
\frac{3}{p}=\frac{1}{1-p}
&\quad\Longrightarrow\quad 3(1-p)=p\\
&\quad\Longrightarrow\quad \hat p=\frac{3}{4}.
\end{aligned}
$$

二阶导数小于零，所以这确实是最大值。直观上也不难理解：四次独立试验里发生了三次，频率是 $3/4$，它正是二项分布中 $p$ 的极大似然估计。

现在才回到 $\theta$。因为 $p=F_T(t_0)$，令

$$
1-\left[1-\left(\frac{t_0}{\theta}\right)^2\right]^2=\frac{3}{4}.
$$

移项：

$$
\left[1-\left(\frac{t_0}{\theta}\right)^2\right]^2=\frac{1}{4}.
$$

题目已经说明有一套系统在 $t_0$ 时仍正常，所以 $\theta>t_0$，括号内的量为正。开方取正根：

$$
1-\left(\frac{t_0}{\theta}\right)^2=\frac{1}{2}.
$$

再移项、开方：

$$
\left(\frac{t_0}{\theta}\right)^2=\frac{1}{2}
\quad\Longrightarrow\quad
\hat\theta=\sqrt{2}\,t_0.
$$

整个过程没有对 $\theta$ 展开过任何复杂求导。

## 为什么可以先估计 p：不变性

这不是“偷懒”，而是极大似然估计的一条基本性质，通常称为**不变性原理**（invariance property）：

> 若 $\hat p$ 是 $p=g(\theta)$ 的极大似然估计，且 $g$ 在参数空间上严格单调、可逆，则 $\theta$ 的极大似然估计 $\hat\theta$ 满足 $g(\hat\theta)=\hat p$。

在本题中，$g(\theta)=F_T(t_0)$。当 $\theta>t_0$ 时，

$$
\frac{\mathrm{d}p}{\mathrm{d}\theta}
=-\frac{4t_0^2}{\theta^3}
\left(1-\frac{t_0^2}{\theta^2}\right)<0,
$$

所以 $g$ 把 $(t_0,+\infty)$ 一一映射到 $(0,1)$：$\theta$ 越大，系统在 $t_0$ 前失效的概率越小；反过来，给定一个失效概率，也能唯一确定 $\theta$。

从似然函数的角度看，两个参数化描述的是同一个最大值，只是坐标不同。把 $\theta$ 的似然函数记作 $\widetilde L(\theta)$，则

$$
\widetilde L(\theta)=L\bigl(g(\theta)\bigr).
$$

在 $p$ 的坐标里找到最大值 $\hat p=3/4$，再解 $g(\theta)=3/4$，和在 $\theta$ 的坐标里直接最大化 $\widetilde L(\theta)$，得到的是同一个点。因此，“先估 $p$，再反解 $\theta$”不是跳步，而是换了一条更短、更清楚的路线。

这里有一个容易忽略的边界：$\theta>t_0$。如果 $\theta\le t_0$，到 $t_0$ 时系统必然已经失效，不可能出现“一套仍正常”的观测，似然函数为 0。所以后面的单调性和开方取正根，都建立在这个条件上。

## 如果一定要写对 θ 的求导

有些同学担心答题卡上不出现“对 $\theta$ 求导”会被扣步骤分。那就用链式法则，仍然不必把 $F_T(t_0)$ 的长式子直接展开。

设 $p=F_T(t_0)$，则

$$
\begin{aligned}
\frac{\mathrm{d}\ln L}{\mathrm{d}\theta}
&=\frac{\mathrm{d}\ln L}{\mathrm{d}p}\cdot\frac{\mathrm{d}p}{\mathrm{d}\theta}\\
&=\left(\frac{3}{p}-\frac{1}{1-p}\right)\frac{\mathrm{d}p}{\mathrm{d}\theta}.
\end{aligned}
$$

因为 $\theta>t_0$ 时 $\dfrac{\mathrm{d}p}{\mathrm{d}\theta}\ne 0$，令整个导数为零，只需要括号为零：

$$
\frac{3}{p}-\frac{1}{1-p}=0
\quad\Longrightarrow\quad
\hat p=\frac{3}{4}.
$$

再由 $F_T(t_0)=3/4$ 反解出 $\hat\theta=\sqrt{2}\,t_0$。

这段写法同时保留了“写出似然函数、取对数、求导、令导数为零”的踩分点，又把求导对象从复杂的 $\theta$ 换成了最简单的 $p$。考场上多写这几行，通常比直接写“由不变性”更稳妥。

## 为什么用概率，不用密度

“连续型用密度，离散型用概率”这句话没有错，但它有一个前提：你确实观测到了连续型随机变量的具体取值。

如果题目说四套系统都测到了具体寿命 $t_1,t_2,t_3,t_4$，似然函数当然应该写成

$$
L(\theta)=\prod_{i=1}^4 f_T(t_i).
$$

但本题的观测方式不是这样。试验到 $t_0$ 就停止，记录下来的只是四个状态：

$$
Y_i=
\begin{cases}
1, & T_i\le t_0 \quad\text{（已失效）},\\
0, & T_i>t_0 \quad\text{（仍正常）}.
\end{cases}
$$

这是一个**定时截尾试验**（fixed-time censoring）。观测到的是离散的 $0/1$ 结果，不是连续的寿命数值，所以似然函数应当是这些状态事件发生的联合概率：

$$
P(Y_1=1,\ldots,Y_4=0)=p^3(1-p).
$$

如果写成 $f_T(t_0)^3[1-F_T(t_0)]$，反而是在说“三套系统恰好在 $t_0$ 这一刻失效”，那是另一种观测，和题目不符。

可以把不同观测方式对应的似然项列成一张表：

| 观测到的信息 | 似然函数中的一项 |
| --- | --- |
| 具体寿命 $T=t_i$ | $f_T(t_i)$ |
| 只知道 $T\le t_0$ | $F_T(t_0)$ |
| 只知道 $T>t_0$ | $1-F_T(t_0)$ |

所以，关键不在于 $T$ 本身是连续型还是离散型，而在于**你实际拿到了什么粒度的数据**。似然函数描述的是“观测机制”，不是随机变量的标签。

## 把这道题压缩成四步

以后再遇到“做了 $n$ 次独立试验，某事件发生 $k$ 次，求参数 $\theta$ 的极大似然估计”，可以先走这条路线：

1. 找到一次试验中那个复杂事件，把它的概率记作 $p$；
2. 写出二项似然 $L(p)\propto p^k(1-p)^{n-k}$，立刻得到 $\hat p=k/n$；
3. 确认 $p=g(\theta)$ 在参数空间上单调可逆；
4. 解方程 $g(\theta)=k/n$，得到 $\hat\theta$。

这道题里，$n=4$、$k=3$，所以 $\hat p=3/4$；而 $g(\theta)=F_T(t_0)$ 在 $\theta>t_0$ 上严格单调，反解即可。

当然，这套做法成立的前提是：试验独立、$n$ 固定、事件概率确实只由 $\theta$ 决定，并且 $g$ 可逆。如果这些条件不成立，还是老老实实回到似然函数的定义。

## 最后

这道题难的从来不是积分或求导，而是两次“翻译”：

- 把连续寿命的系统问题，翻译成 $t_0$ 时刻的伯努利试验；
- 把对 $\theta$ 的估计，翻译成对失效概率 $p$ 的估计。

想清楚这两层，第二问真的只剩两行：

$$
\hat p=\frac{3}{4},
\quad
F_T(t_0)=\frac{3}{4},
\quad
\hat\theta=\sqrt{2}\,t_0.
$$

极大似然估计的本质，不是把式子写得越长越像在做题，而是找到那个让观测结果最可能发生的参数。换一个更好用的参数来描述同一个模型，往往比硬算更接近统计学的想法。

<figure class="article-figure article-figure-map">
  <a href="../../images/mle-overview.png" target="_blank" rel="noopener">
    <img src="../../images/mle-overview.png" alt="极大似然估计知识地图：从概率与似然的区别、似然函数构造、不变性，到截尾数据和常见陷阱的九宫格总结" width="1292" height="554" loading="lazy" decoding="async" />
  </a>
  <figcaption>一张把概率、似然、不变性和截尾试验串起来的知识地图。图中文字较密，点击可放大查看原图。</figcaption>
</figure>
