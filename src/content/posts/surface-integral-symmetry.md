---
title: '带绝对值的第二类曲面积分：曲面分块、两类转换与对称性妙用'
description: '被积函数含绝对值且分母在 z 轴为零，盲目套用高斯公式容易踩坑。通过曲面分块转换、光滑项高斯拆分，以及坐标投影对称性三种解法，彻底吃透考研曲面积分的计算精髓。'
date: 2026-10-27
category: learning
tags: ['高等数学', '曲面积分', '对称性', '高斯公式', '考研数学']
cover: integral
featured: false
---

先看原题。

<figure class="article-figure article-figure-scan">
  <a href="../../images/surface-integral-problem.png" target="_blank" rel="noopener">
    <img src="../../images/surface-integral-problem.png" alt="题目原题：计算第二类曲面积分，曲面为圆柱面与平面 z=1, z=-1 所围立体表面的外侧" width="1024" height="165" decoding="async" />
  </a>
  <figcaption>原题。点击图片可查看大图。</figcaption>
</figure>

$$
I = \iint_{\Sigma} x\left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}y\mathrm{d}z + y\left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}z\mathrm{d}x + z\left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y
$$

其中 $\Sigma$ 是圆柱面 $x^2 + y^2 = 1$ 与平面 $z = 1, z = -1$ 所围立体表面的外侧。

这道题的最终正确答案是：

$$
I = 7\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

本题是考研数学一中非常具有代表性的**第二类（对坐标的）曲面积分**综合大题。初看题目，许多同学容易因为看到“封闭曲面外侧”而盲目套用高斯公式，或者被被积函数中复杂的绝对值分式吓住。

实际上，只要厘清曲面各部分的几何特征与法向量方向，结合对称性与两类曲面积分的联系，整道题的计算量可以被大幅压缩。

下面我们先剖析为什么不能盲目使用高斯公式，随后给出三种层次分明的求解思路，并附上核心三角积分的两种计算技巧。

---

## 避坑预警：为什么不能直接全式套用高斯公式？

遇到封闭曲面的第二类曲面积分，直觉反应往往是高斯公式（散度定理）：

$$
\oiint_{\Sigma} P\,\mathrm{d}y\mathrm{d}z + Q\,\mathrm{d}z\mathrm{d}x + R\,\mathrm{d}x\mathrm{d}y = \iiint_{\Omega} \left(\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}\right)\mathrm{d}v
$$

但必须牢记：**高斯公式成立的前提，是被积函数在闭区域 $\Omega$ 上具有一阶连续偏导数。**

本题的被积函数在两个地方破坏了这一前提：
1. **分母奇点**：分母包含 $|x| + |y|$，在 $z$ 轴（即 $x = 0, y = 0$）上分母为零，被积函数在立体内部根本没有定义；
2. **绝对值不可导**：由于绝对值的存在，函数在坐标面 $x = 0$ 和 $y = 0$ 处不满足一阶偏导数连续的条件。

如果直接对整个被积函数求偏导并代入高斯公式，就犯了“忽视适用条件”的原则性错误。

---

## 方法一：按曲面分块 + 两类曲面积分转换法（最稳妥、最推荐）

封闭立体表面 $\Sigma$ 由三部分拼成：
- **上底面 $\Sigma_1$**：平面 $z = 1$（取上侧），$x^2 + y^2 \le 1$；
- **下底面 $\Sigma_2$**：平面 $z = -1$（取下侧），$x^2 + y^2 \le 1$；
- **圆柱侧面 $\Sigma_3$**：圆柱面 $x^2 + y^2 = 1$（$-1 \le z \le 1$，取外侧）。

观察法向量的几何特点，不同坐标项在不同曲面上有天然的“零分量”，因此将原积分拆为两块：

$$
I = I_{\text{上下}} + I_{\text{侧}}
$$

### 1. 计算上下底面（$\mathrm{d}x\mathrm{d}y$ 项）

在圆柱侧面 $\Sigma_3$ 上，法向量与 $z$ 轴正交（$\cos\gamma = 0$），故侧面上的 $\mathrm{d}x\mathrm{d}y = 0$。因此 $\mathrm{d}x\mathrm{d}y$ 项只需在上下底面计算。

而在上下底面上，法向量与 $x$ 轴、$y$ 轴垂直（$\cos\alpha = 0, \cos\beta = 0$），所以 $\mathrm{d}y\mathrm{d}z$ 和 $\mathrm{d}z\mathrm{d}x$ 项为零。

将 $\Sigma_1$ 与 $\Sigma_2$ 投影到 $xOy$ 平面上的底圆域 $D: x^2 + y^2 \le 1$：
- **上底面 $\Sigma_1$**：$z = 1$，取上侧（方向向量与 $z$ 轴同向，$\mathrm{d}x\mathrm{d}y > 0$）：
  $$
  \iint_{\Sigma_1} z\left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y = +\iint_D 1 \cdot \left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y
  $$
- **下底面 $\Sigma_2$**：$z = -1$，取下侧（方向向量与 $z$ 轴反向，投影需添负号）：
  $$
  \iint_{\Sigma_2} z\left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y = -\iint_D (-1) \cdot \left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y = +\iint_D 1 \cdot \left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y
  $$

两者相加：

$$
I_{\text{上下}} = 2\iint_D \left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y = 2\iint_D 1\,\mathrm{d}x\mathrm{d}y + 2\iint_D \frac{|x|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y
$$

圆域 $D$ 的面积为 $\pi \cdot 1^2 = \pi$，故常数项积分为 $2\pi$。

后半部分利用圆域 $D$ 关于 $y = x$ 的**轮换对称性**：将 $x$ 与 $y$ 对调，积分区域不变，故

$$
\iint_D \frac{|x|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y = \iint_D \frac{|y|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y = \frac{1}{2}\iint_D \frac{|x| + |y|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y = \frac{1}{2}\iint_D 1\,\mathrm{d}x\mathrm{d}y = \frac{\pi}{2}
$$

代入即得：

$$
I_{\text{上下}} = 2\pi + 2 \times \frac{\pi}{2} = 3\pi
$$

### 2. 计算圆柱侧面（$\mathrm{d}y\mathrm{d}z$ 与 $\mathrm{d}z\mathrm{d}x$ 项）

圆柱侧面 $\Sigma_3$ 方程为 $x^2 + y^2 = 1$（$-1 \le z \le 1$），取外侧。

在侧面上，单位外法向量方向余弦为：

$$
\vec{n} = (\cos\alpha, \cos\beta, \cos\gamma) = (x, y, 0)
$$

利用两类曲面积分的转换关系：

$$
\mathrm{d}y\mathrm{d}z = \cos\alpha\,\mathrm{d}S = x\,\mathrm{d}S, \qquad \mathrm{d}z\mathrm{d}x = \cos\beta\,\mathrm{d}S = y\,\mathrm{d}S
$$

代入侧面积分：

$$
\begin{aligned}
I_{\text{侧}} &= \iint_{\Sigma_3} \left[ x\left(1 + \frac{1}{|x| + |y|}\right)x + y\left(1 + \frac{1}{|x| + |y|}\right)y \right]\mathrm{d}S \\
&= \iint_{\Sigma_3} (x^2 + y^2)\left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}S
\end{aligned}
$$

因为在 $\Sigma_3$ 上恒有 $x^2 + y^2 = 1$，因式 $(x^2 + y^2)$ 恰好变为常数 $1$：

$$
I_{\text{侧}} = \iint_{\Sigma_3} \left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}S
$$

采用柱面坐标参数化：$x = \cos\theta, y = \sin\theta, z = z$（$\theta \in [0, 2\pi], z \in [-1, 1]$），面积微元为 $\mathrm{d}S = 1 \cdot \mathrm{d}\theta\mathrm{d}z$。

由于被积函数不含 $z$，对 $z$ 的积分直接提出：

$$
I_{\text{侧}} = \left(\int_{-1}^1 \mathrm{d}z\right) \int_0^{2\pi} \left(1 + \frac{1}{|\cos\theta| + |\sin\theta|}\right)\mathrm{d}\theta = 2\left[2\pi + \int_0^{2\pi} \frac{1}{|\cos\theta| + |\sin\theta|}\mathrm{d}\theta\right]
$$

由三角函数在四个象限的周期性与对称性，四个象限的积分值完全相等：

$$
\int_0^{2\pi} \frac{1}{|\cos\theta| + |\sin\theta|}\mathrm{d}\theta = 4\int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta
$$

定积分 $\int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta = \sqrt{2}\ln(\sqrt{2} + 1)$（具体计算见后文技巧专节）。代入得：

$$
I_{\text{侧}} = 2\left[2\pi + 4\sqrt{2}\ln(\sqrt{2} + 1)\right] = 4\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

### 3. 汇总结果

$$
I = I_{\text{上下}} + I_{\text{侧}} = 3\pi + 4\pi + 8\sqrt{2}\ln(\sqrt{2} + 1) = 7\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

---

## 方法二：线性拆分法（光滑项高斯公式 + 奇异项定向分离）

既然全式不能用高斯公式，症结全在带绝对值分式上，我们完全可以将原积分线性拆解为**光滑多项式部分**与**奇异分式部分**：

$$
I = I_A + I_B
$$

其中：

$$
I_A = \iint_{\Sigma} x\,\mathrm{d}y\mathrm{d}z + y\,\mathrm{d}z\mathrm{d}x + z\,\mathrm{d}x\mathrm{d}y
$$

$$
I_B = \iint_{\Sigma} \frac{x}{|x| + |y|}\,\mathrm{d}y\mathrm{d}z + \frac{y}{|x| + |y|}\,\mathrm{d}z\mathrm{d}x + \frac{z|x|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y
$$

### 对 $I_A$：直接套用高斯公式

$I_A$ 的被积函数分量 $P = x, Q = y, R = z$ 在整个柱体立体 $\Omega$ 上处处无穷阶可导，闭曲面 $\Sigma$ 取外侧，完全满足高斯公式条件：

$$
I_A = \iiint_{\Omega} \left(\frac{\partial x}{\partial x} + \frac{\partial y}{\partial y} + \frac{\partial z}{\partial z}\right)\mathrm{d}v = \iiint_{\Omega} (1 + 1 + 1)\,\mathrm{d}v = 3 V_{\Omega}
$$

柱体体积为底面积乘高：$V_{\Omega} = (\pi \cdot 1^2) \times [1 - (-1)] = 2\pi$。

因此：

$$
I_A = 3 \times 2\pi = 6\pi
$$

几秒钟即可拿下常规通量部分，极大地减少了冗余推导！

### 对 $I_B$：按曲面特性分化

对于剩下的奇异部分 $I_B$：
1. **底面（$\mathrm{d}x\mathrm{d}y$ 项）**：侧面上 $\mathrm{d}x\mathrm{d}y = 0$，仅在上下底面非零。由 $z = \pm 1$ 处的定向投影：
   $$
   \iint_{\Sigma_1+\Sigma_2} \frac{z|x|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y = 2\iint_D \frac{|x|}{|x| + |y|}\,\mathrm{d}x\mathrm{d}y = 2 \times \frac{\pi}{2} = \pi
   $$
2. **侧面（$\mathrm{d}y\mathrm{d}z, \mathrm{d}z\mathrm{d}x$ 项）**：上下底面上法向垂直于面，这两项为零；在侧面 $x^2 + y^2 = 1$ 上利用两类转换：
   $$
   \iint_{\Sigma_3} \left(\frac{x^2}{|x| + |y|} + \frac{y^2}{|x| + |y|}\right)\mathrm{d}S = \iint_{\Sigma_3} \frac{1}{|x| + |y|}\,\mathrm{d}S = 8\sqrt{2}\ln(\sqrt{2} + 1)
   $$

汇总 $I_B$：

$$
I_B = \pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

两部分合拢：

$$
I = I_A + I_B = 6\pi + \pi + 8\sqrt{2}\ln(\sqrt{2} + 1) = 7\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

---

## 方法三：坐标面直接投影 + 卦限全对称性化简

如果坚持不转为第一类曲面积分，直接按照第二类曲面积分的定义向坐标面投影，同样可以利用区域与函数的强对称性迅速破题。

### 1. 投影到 $xOy$ 面（$z$ 分量）

$$
I_z = \iint_{\Sigma} z\left(1 + \frac{|x|}{|x| + |y|}\right)\mathrm{d}x\mathrm{d}y
$$

侧面法向量水平，投影为零；上下两底面的法向量与 $z$ 正负号保持一致，投影均同向叠加为 $2\iint_D \left(1 + \frac{|x|}{|x|+|y|}\right)\mathrm{d}x\mathrm{d}y = 3\pi$。

### 2. 投影到 $yOz$ 面与 $zOx$ 面

由空间区域与被积函数关于 $x$ 和 $y$ 的对称性，显然有：

$$
I_x = \iint_{\Sigma} x\left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}y\mathrm{d}z = I_y = \iint_{\Sigma} y\left(1 + \frac{1}{|x| + |y|}\right)\mathrm{d}z\mathrm{d}x
$$

我们只需算 $I_x$。将柱面 $\Sigma_3$ 沿 $x = 0$ 拆分为前侧 $\Sigma_{\text{前}}$（$x = \sqrt{1 - y^2}$，取前侧，外法向 $\cos\alpha > 0$）与后侧 $\Sigma_{\text{后}}$（$x = -\sqrt{1 - y^2}$，取后侧，外法向 $\cos\alpha < 0$）。

投影区域均为矩形 $D_{yz}: -1 \le y \le 1, -1 \le z \le 1$：
- 前侧：$+\iint_{D_{yz}} \sqrt{1 - y^2}\left(1 + \frac{1}{\sqrt{1 - y^2} + |y|}\right)\mathrm{d}y\mathrm{d}z$
- 后侧：$-\iint_{D_{yz}} \left(-\sqrt{1 - y^2}\right)\left(1 + \frac{1}{|-\sqrt{1 - y^2}| + |y|}\right)\mathrm{d}y\mathrm{d}z = +\iint_{D_{yz}} \sqrt{1 - y^2}\left(1 + \frac{1}{\sqrt{1 - y^2} + |y|}\right)\mathrm{d}y\mathrm{d}z$

前后两侧贡献完全相同！对 $z$ 积分得 $\int_{-1}^1 \mathrm{d}z = 2$，对 $y$ 利用对称性化到 $[0, 1]$：

$$
I_x = 2 \times 2 \times 2 \int_0^1 \sqrt{1 - y^2}\left(1 + \frac{1}{\sqrt{1 - y^2} + y}\right)\mathrm{d}y = 8 \int_0^1 \sqrt{1 - y^2}\left(1 + \frac{1}{\sqrt{1 - y^2} + y}\right)\mathrm{d}y
$$

令 $y = \sin\theta$（$\theta \in [0, \pi/2]$），则 $\sqrt{1 - y^2} = \cos\theta, \mathrm{d}y = \cos\theta\,\mathrm{d}\theta$：

$$
I_x = 8\int_0^{\pi/2} \cos^2\theta\,\mathrm{d}\theta + 8\int_0^{\pi/2} \frac{\cos^2\theta}{\cos\theta + \sin\theta}\,\mathrm{d}\theta
$$

由点火公式，$\int_0^{\pi/2} \cos^2\theta\,\mathrm{d}\theta = \frac{\pi}{4}$，第一项为 $8 \times \frac{\pi}{4} = 2\pi$。

对第二项，由对称性：

$$
\int_0^{\pi/2} \frac{\cos^2\theta}{\cos\theta + \sin\theta}\,\mathrm{d}\theta = \int_0^{\pi/2} \frac{\sin^2\theta}{\cos\theta + \sin\theta}\,\mathrm{d}\theta = \frac{1}{2}\int_0^{\pi/2} \frac{\cos^2\theta + \sin^2\theta}{\cos\theta + \sin\theta}\,\mathrm{d}\theta = \frac{1}{2}\int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta
$$

平方和因式直接化为 $1$，原式立即化为：

$$
I_x = 2\pi + 4\int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta = 2\pi + 4\sqrt{2}\ln(\sqrt{2} + 1)
$$

因为 $I_y = I_x$，所以侧面总和为：

$$
I_x + I_y = 2 I_x = 4\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)
$$

加上 $I_z = 3\pi$，同样精确得出 $7\pi + 8\sqrt{2}\ln(\sqrt{2} + 1)$。

---

## 核心三角积分技巧：$\int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta$ 怎么算？

在上述三种解法中，最后都归结到定积分：

$$
J = \int_0^{\pi/2} \frac{1}{\cos\theta + \sin\theta}\,\mathrm{d}\theta
$$

考研中计算此类积分有两种最主流的有效手段。

### 技巧一：辅助角公式 + 正割积分（考场速度最快）

利用辅助角公式合并分母：

$$
\cos\theta + \sin\theta = \sqrt{2}\cos\left(\theta - \frac{\pi}{4}\right)
$$

换元令 $u = \theta - \frac{\pi}{4}$，当 $\theta \in [0, \pi/2]$ 时，$u \in [-\pi/4, \pi/4]$：

$$
J = \frac{1}{\sqrt{2}}\int_{-\pi/4}^{\pi/4} \frac{1}{\cos u}\,\mathrm{d}u = \frac{1}{\sqrt{2}}\int_{-\pi/4}^{\pi/4} \sec u\,\mathrm{d}u
$$

因为 $\sec u$ 是偶函数，化为正半轴的两倍：

$$
J = \frac{2}{\sqrt{2}}\int_0^{\pi/4} \sec u\,\mathrm{d}u = \sqrt{2}\ln|\sec u + \tan u|\Big|_0^{\pi/4}
$$

代入上下限：
- 当 $u = \pi/4$ 时，$\sec(\pi/4) = \sqrt{2}, \tan(\pi/4) = 1$，值为 $\ln(\sqrt{2} + 1)$；
- 当 $u = 0$ 时，$\sec 0 = 1, \tan 0 = 0$，值为 $\ln 1 = 0$。

立得：

$$
J = \sqrt{2}\ln(\sqrt{2} + 1)
$$

### 技巧二：分子分母同乘 $\cos u$ 凑微分（遗忘公式时的保底绝招）

如果考场紧张，一时记不清 $\sec u$ 的原函数公式，可以采用经典的凑微分法：

$$
\int \frac{1}{\cos u}\,\mathrm{d}u = \int \frac{\cos u}{\cos^2 u}\,\mathrm{d}u = \int \frac{\mathrm{d}(\sin u)}{1 - \sin^2 u}
$$

令 $t = \sin u$，$u \in [0, \pi/4]$ 对应 $t \in [0, \frac{\sqrt{2}}{2}]$：

$$
\int_0^{\sqrt{2}/2} \frac{1}{1 - t^2}\,\mathrm{d}t = \frac{1}{2}\ln\left|\frac{1 + t}{1 - t}\right|\Bigg|_0^{\sqrt{2}/2} = \frac{1}{2}\ln\left(\frac{1 + \frac{\sqrt{2}}{2}}{1 - \frac{\sqrt{2}}{2}}\right) = \frac{1}{2}\ln\left(\frac{2 + \sqrt{2}}{2 - \sqrt{2}}\right)
$$

分子分母有理化：

$$
\frac{2 + \sqrt{2}}{2 - \sqrt{2}} = \frac{(2 + \sqrt{2})^2}{4 - 2} = \frac{6 + 4\sqrt{2}}{2} = 3 + 2\sqrt{2} = (\sqrt{2} + 1)^2
$$

因此：

$$
\frac{1}{2}\ln\left[(\sqrt{2} + 1)^2\right] = \ln(\sqrt{2} + 1)
$$

再乘以前方的 $\sqrt{2}$，结果分毫不差。初等变换一步到位，完全不需要死记偏僻公式。

---

## 考研复盘：遇到此类综合曲面积分的心法

这道题把考研数学一中曲面积分的几个高频考点融合得非常巧妙。在复习与应试中，建议固化以下三条思考路径：

1. **先看拓扑与奇点，再定是否高斯**：
   看到封闭曲面，千万别提笔就套高斯公式。先快速扫视分母是否存在 $x=0, y=0$ 等无定义点，以及是否存在绝对值。如果存在奇点，要么**局部挖洞**，要么**按曲面分块**。
2. **圆柱与圆球是两类曲面积分转换的天然载体**：
   在柱面 $x^2 + y^2 = R^2$ 上，$x\mathrm{d}y\mathrm{d}z + y\mathrm{d}z\mathrm{d}x = (x^2 + y^2)\mathrm{d}S = R^2\mathrm{d}S$；在球面 $x^2 + y^2 + z^2 = R^2$ 上，$x\mathrm{d}y\mathrm{d}z + y\mathrm{d}z\mathrm{d}x + z\mathrm{d}x\mathrm{d}y = R^2\mathrm{d}S$。一旦识别出这种齐次因式，转换成第一类曲面积分往往是降维打击。
3. **轮换对称性善后分式项**：
   形如 $\iint_D \frac{|x|}{|x| + |y|}\,\mathrm{d}\sigma$ 的积分，只要区域 $D$ 满足 $x, y$ 对称，直接利用轮换对称性对半拆解为 $\frac{1}{2}\iint_D 1\,\mathrm{d}\sigma$，完全不需要费时费力去分象限讨论。
