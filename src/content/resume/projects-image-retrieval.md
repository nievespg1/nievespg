---
section: "projects"
order: 1
title: "How to Find Similar Images Using Math — Medium Essay (2020)"
---

**How to Find Similar Images Using Math: A Gentle Introduction to Image Retrieval and Neural Networks**

Published on Medium — June 22, 2020 (updated August 11, 2020) · 25 min read

Wrote an introductory essay explaining the evolution of image retrieval — color histograms (RGB channel distributions), global representations, edge detection, SIFT keypoints and descriptors, and neural codes (deep features from CNNs). The essay covers:

- **Color histogram retrieval**: Computing 48-bin normalized histograms per RGB channel, Euclidean distance similarity metric across 192 images
- **Shape-based retrieval**: SIFT keypoint extraction with Lowe's ratio test for match filtering, RANSAC geometric verification for correspondence
- **Neural feature retrieval**: Fine-tuned DenseNet-161 on a custom 8-class landmark dataset using transfer learning, extracted convolutional activation vectors as global descriptors, and computed Convolutional Activation Maps (CAM) for network attention visualization
- **Performance comparison**: Color histograms (249KB storage) vs SIFT (590MB) vs deep features (87MB), with deep features matching SIFT retrieval accuracy at ~7× storage reduction

Includes mathematical derivations, NumPy/PyTorch code examples, OpenCV feature extraction pipelines, and CNN kernel visualization. All code is publicly available on [GitLab](https://gitlab.com/nievespg/image_retrieval_blog). Published under topics: Image Retrieval, Machine Learning, PyTorch, NumPy, Python.