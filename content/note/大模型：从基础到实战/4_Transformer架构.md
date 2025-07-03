---
title: 4_Transformer架构
date: 2025-07-03
details: 
---
# 4_Transformer架构
## 1 深度学习与Transformer
### 1.1 引言
- NLP 自然语言处理
    - NLU 自然语言理解 Encoder Only
    - NLT 自然语言转化 Encoder-Decoder
    - NLG 自然语言生成 Decoder Only
### 1.2 词向量化
- One-Hot Encoding 独热编码
    - 适用于小词汇表
    - 高维稀疏，维度灾难
    - 没有语义信息，词序忽略
    - 泛化能力差
    - 缺乏向量运算能力
- Bag-of-words model 词袋模型
    - 特征空间过大，噪声敏感
- TF-IDF(Term Frequency-Inverse Document Frequency)
    - $w_{x,y} = tf_{x,y} \times $
- N-gram
    - 将文本中的连续N个词语作为一个单元进行处理，形成一个N-gram序列。
    - 再通过统计文本中不同N-gram序列权重得分（词频，TF-IDF等），以得到文本的表示。
- Brown Clustering
- Word2Vec
    - 基于神经网络的Word Embedding模型，通过建模单词与其邻近词之间推理关系，训练得到词向量表示。
    - 词向量是副产物。
- GloVe
- FastText
    - 基于subword的Word Embedding模型。
    - 将每个单词表示为子词的集合，通过对文本中的子词进行训练，将每个子词映射到对应的向量表示，并通过平均或拼接这些子词向量来表示整个单词。
    - 可以很大缓解OOV问题。
### 1.3 NLP传统机器学习模型
#### 分类问题
- 逻辑回归（Logistic regression）
- 朴素贝叶斯（Naive Bayes）
- 决策树（Decision trees）
- 支持向量机（Support Vector Machine）
    - 通过引入核函数来处理非线性可分的情况
#### 序列问题
- 隐马尔可夫模型
    - 概率有向图
- 条件随机场
    - 概率无向图
### 1.4 NLP深度学习技术
- DAN：Deep Averaging Network
    - 神经词袋模型，即简单对文本序列中每个Word Embedding进行平均，作为整个序列的表示
- CNN
- RvNN
- RNN 