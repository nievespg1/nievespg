---
title: "Evaluation of neural code compression techniques for image retrieval"
summary: "Evaluating compression techniques for neural codes in image retrieval tasks, comparing PCA and LDA across ResNet-50, DenseNet161, and VGG16 architectures."
technologies:
  - Python
  - PyTorch
  - ResNet-50
  - DenseNet161
  - VGG16
  - PCA
  - LDA
  - Image Retrieval
featured: true
paper: "https://drive.google.com/file/d/1KcHh7nALWzn1dHgPgrlvfTWjfgTQ8-wO/view"
---

**Gabriel Nieves-Ponce**  
University of Maryland Baltimore County  
[nieves1@umbc.edu](mailto:nieves1@umbc.edu)

## Abstract

In the paper babenko et al. proved that the activations invoked by an image within the top layers of a large convolutional neural network provide a high-level descriptor of the visual content of the image. While its paper provided evidence that compressed neural codes outperform compressed stated of the art descriptors, they didnt explore alternate deep neural network (DNN) architectures.

In this paper, I evaluate the improvement in the retrieval performance of three states of the art DNN architectures when the network is retrained on a dataset of images that are similar to images encountered at test time. Furthermore, I examine these models and provide visualization in an effort to better understand their convolutional kernels and the relationship between the quality of the neural codes and the DNN convolutional layers. As in the original, we compressed neural codes and show that a simple PCA compression provides very good short codes that give state-of-the-art accuracy on both the Pasis6k dataset as well as the oxford5k dataset. An attempt was made to evaluate neural codes using Linear Discriminant Analysis (LDA), but due to some technical limitations, we were unable to compress all the features using LDA.

## I. Introduction

Machine learning has revolutionized many popular areas of studies, becoming ubiquitous in fields such as information retrieval, medicine, banking, and transportation. All of these fields could be broken down even further into a plethora of sub-fields that could in themselves be decomposed even further. For the purpose of this paper, I will focus mostly on a sub-field of information retrieval crawled image retrieval. There has been exhaustive research to find meaningful semantic relationships between similar images. In the past, it was common to use highly constraint algorithms that evaluated low-level relationships such as edges, angles, and colors. Scale Invariant Feature Transform (SIFT) [[3]](#ref-3) and Speed up Robust Features (SURF) [[4]](#ref-4) are examples of such algorithms.

In the paper, *Neural codes for image retrieval*, 2014; A. Babenko et al [[5]](#ref-5) showed improved performance with the compressed features generated in the convolutional layers of a neural network when compared to copmressed handcrafted descriptors; he called these features, neural codes. While yielding better overall performance, these features tend to produce high-rank vectors, much larger than the alternative descriptors. This increase in cardinality means that we will need more resources to compute the larger features as well as increased storage capacity. To mitigate this, the author reduces the cardinality of the feature vector space with the use of Principal Component Analysis (PCA) and Discriminative dimensionality.

It was shown that compressing the neural codes using PCA negatively affects overall performance. This is to be expected of PCA since it attempts to model the distribution of the data by computing the eigenvectors - principal components - and selecting those with the highest eigenvalues for a particular set. This method is biased towards dimensions that provide a larger separation of the data; ie: forms better clusters. I proposed that an alternative solution such as Product Quantization (PQ) [[6]](#ref-6) or Optimized Product Quantization (OPQ) [[7]](#ref-7) would do a better job of finding such clusters and producing compact codes with higher resolution.

In this essay, I will provide quantitative results from experiments where I show the performance of compressed codes using each of the aforementioned techniques. In the subsequent sections you should expect to see experimental results such as Mean average Precision, precision-recall curve and compute time for each of the algorithms, corpus details, machine learning models used and training code.

## II. Survey of Relevant Work

*Scale invariant feature transform*, 2004; T. Lindeberg, et al. [[3]](#ref-3) Proposes a new algorithm that achieves state of the art results when compared to alternate handcrafted feature extraction algorithms. It achieves these results in part due to its scale invariably, that is to say, its ability to extract feature descriptors on similar images even if they are different sizes; an issue that has been part of such algorithms.

*Speeded Up Robust Features*, 2006; H. Bay, et al. [[4]](#ref-4) Is yet another feature descriptor extractor algorithm. SURF was heavily influenced by SIFTs scale invariability there for it is also scale invariant. Where SURF improves uppon SIFT is in its computation time. SURF up to four times faster than SIFT while still maintaining comparable accuracy to SIFT.

In its paper, *Neural codes for image retrieval*, 2014; A. Babenko et al [[5]](#ref-5). showed improved performance with the features generated in the convolutional layers of a neural network when compared to the handcrafted descriptors; he called these features, neural codes. Furthermore, the author proofs that the neural codes are able to outperform traditional image descriptors even when compressed to lower dimensionality representations with the use of PCA.

*Product Quantization for Nearest Neighbor Search*, 2011; H. Jgou, et al. [[6]](#ref-6) introduces a product quantization-based approach for approximate nearest neighbor search. The idea is to decompose the space into a Cartesian product of low-dimensional subspaces and to quantize each subspace separately. A vector is represented by a short code composed of its subspace quantization indices. *Optimized Product Quantization for Approximate Nearest Neighbor Search*, 2013; T. Ge, et al. proposes an optimization to *Product Quantization for Nearest Neighbor Search*, 2011; H. Jgou, et al. [[6]](#ref-6); by minimizing quantization distortions w.r.t. the space decomposition and the quantization codebooks

*A Tutorial on Principal Component Analysis*, 2002; Lindsay I. Smith. provides a detail description of PCA as well as an implementation of the algorithm.

## III. Experiment

It is known that the quality of your neural codes is directly correlated to both the quaility of your dataset and the architecture of your model. One of the problems that I see with the neural codes generated in their paper [[5]](#ref-5) is that we do not explore the results of more than one deep neural network (DNN) architecture.

In this paper I will use thee of the mos popular DNN achitectures available and finetune them for the task as hand. I will also provide some other metrics regarding their performance. In the next few section I will disscuss, in detail, how we achieve this.

### A. Dataset

We initially wanted to train our classification model on the Google Landmark Dataset v2 (GLDv2) [[9]](#ref-9). The GLDv2 is a collection of 5M images with approximately 200k+ classes. Altho this massive dataset seems like a good fit for our current task, it suffers from a very long class distribution tail as seen in [Fig. 1](#fig-1).

<a id="fig-1"></a>

![The Google Landmarks Dataset v2 class distribution and example landmark images](https://drive.google.com/thumbnail?id=1YssfNJaWfU_wOw64lBMOxZaq2Iz7IAK0&sz=w1000)

**Fig. 1.** The Google Landmarks Dataset v2 contains a variety of natural and human-made landmarks from around the world. Since the class distribu-tion is very long-tailed, the dataset contains a large number of lesser-known local landmarks.

As a second hurdle, we realize that the size of the dataset in conjunction with the DNNs was a bit too much for our computing resources. To optimize for this I decided to train our DNN on the 10,000 most frequent classes. Truncating the dataset like this helps speed up training time as well as minimizing the memory overhead. Even when optimizing for our resources, the size and complexity of the dataset were too much and after 24 hours of training, we had achieved negligible validation loss.

In order to meet the deadline, I dropped the GLDv2 and opted for a simpler approach. The dataset that was ultimately used to train our DNNs was called from the web using the Yandex[^1] search engine. I downloaded the images using the same queries from the Paris6k [[10]](#ref-10) and Oxford5k [[11]](#ref-11) as seen in [Table I](#table-i).

<a id="table-i"></a>

| Query Term | Number of images found |
|---|---:|
| All Souls Oxford | 467 |
| Arc de Triomphe | 463 |
| Ashmolean | 475 |
| Balliol Oxford | 484 |
| Bodleian Oxford | 466 |
| Christ Church Oxford | 467 |
| Cornmarket Oxford | 474 |
| Eiffel Tower | 478 |
| Hertford Oxford | 484 |
| Hotel des Invalides | 487 |
| Jesus Oxford | 338 |
| Keble Oxford | 463 |
| La Defense | 482 |
| Louvre | 457 |
| Magdalen Oxford | 427 |
| Moulin Rouge | 476 |
| Musee d'Orsay | 461 |
| New Oxford | 196 |
| Notre Dame | 464 |
| Oriel Oxford | 376 |
| Pantheon | 465 |
| Pitt Rivers | 464 |
| Pompidou | 470 |
| Radcliffe Camera Oxford | 460 |
| Sacre Coeur | 458 |
| Trinity Oxford | 463 |
| Worcester Oxford | 440 |

**Table I.** train dataset distribution

[^1]: [https://yandex.com/](https://yandex.com/)

### B. Model Architecture

For this experiment I decided to use the following DNN models: ResNet-50 [[14]](#ref-14), DenseNet161 [[13]](#ref-13), VGG16 [[12]](#ref-12). I plan to use the VGG16 model as a baseline since it provides adecudate classification performance. Since ResNet50 and DenseNet161 yield higher higher classification performance than VGG16, we will used them to see if we can compute better neural codes.

### C. Training

For the training porting we use a python library called pytroch [[1]](#ref-1). Our deep neural network is composed of three layers. The main layer attempts to segment the cells in our image so that we can generate features for each cell individually. I believe that googles ResNet-50 will be great for this job. I re-trained the layer on our dataset and benchmark the progress. Our second layer will be our feature extraction where the neural codes are computed. I used google's ResNet-50 architecture along the other models to extract global features that will be used to predict the labels of each landmark. Our final layer will be a fully-connected layer that will be trained to predict all possible labels for each cell within the image.

I downloaded pre-trained versions of these models that were trained on the ImageNet dataset. Afterwards, I train the model on single labels in an effort to optimize for such labels achieving above 90% top-5 accuracy. The training configuration can be found in Fig [II](#table-ii) [IV](#table-iv).

<a id="table-ii"></a>

| Criterion | Optimizer |
|---|---|
| Cross Entropy Loss | Stochastic Gradient Descent |

**Table II.**

<a id="table-iii"></a>

**Initial Conditions**

| Model | Learning Rate | momentum | epochs |
|---|---:|---:|---:|
| ResNet-50 | 0.01 | 0.9 | 150 |
| DenseNet161 | 0.01 | 0.9 | 150 |
| VGG | 0.01 | 0.9 | 100 |

**Table III.** We reduce the the learining by a factor of 10 every 40 epochs.

<a id="table-iv"></a>

**Training Results**

| Model | Top-1 Acc. | Top-5 Acc. | Top-10 Acc. |
|---|---:|---:|---:|
| ResNet-50 | 76% | 94% | 98% |
| DenseNet161 | 73% | 92% | 97% |
| VGG | 69% | 90% | 97% |

**Table IV.** Test accuracy results.

We can see that both ResNet-50 [2](#fig-2) and DenseNet161 [3](#fig-3) have learned significant relationships that when evaluated via convolutional activations mas, they are able to localize the landmarks within images without being trained localization tasks. We can also see that VGG [4](#fig-4) has a much weaker activation than both ResNet-50 and DenseNet161

<a id="fig-2"></a>

![ResNet-50 convolutional activation maps](https://drive.google.com/thumbnail?id=1LU91-pSvb4bZJxdsCnLAsKeSKAk3buTp&sz=w1000)

**Fig. 2.** ResNet-50 Convolutional Activation Map (CAM)

<a id="fig-3"></a>

![DenseNet161 convolutional activation maps](https://drive.google.com/thumbnail?id=1-z2Yx5HIFO7Epm7eO3GX8RBx9G9nuEOi&sz=w1000)

**Fig. 3.** DenseNet161 Convolutional Activation Map (CAM)

<a id="fig-4"></a>

![VGG16 convolutional activation maps](https://drive.google.com/thumbnail?id=18Ua-SiWShnX5_jjczvXcNZ4wLSs8zIid&sz=w1000)

**Fig. 4.** VGG16 Convolutional Activation Map (CAM)

### D. Retrieval Performance

For the retrieval performance test I decided to use the Paris6k [[10]](#ref-10) and Oxford5k [[11]](#ref-11) dataset same as in the *Neural codes for image retrieval*, 2014; A. Babenko et al [[5]](#ref-5), paper. This will give us a good benchmark for how well our features are performing.

I compressed these features using both PCA and LDA. Due to the limitation mentioned at the beginning of the paper, I was only able to compute LDA features with 16 components. Our results yielded promissing results as seen in the following tables [VI](#table-vi)

<a id="table-v"></a>

**Baseline Retrieval Results (mAP)**

| Model | Dim | Paris | Oxford | Oxford 105K |
|---|---:|---:|---:|---:|
| ResNet-50 | 100352 | 2.78 | 0.2838 | N/A |
| DenseNet161 | 108192 | 3.01 | 0.3971 | N/A |
| VGG | 150528 | 2.13 | 0.0963 | N/A |

**Table V.** Uncompressed (raw) neural features

<a id="table-vi"></a>

**Compressed neural features with LDA**

| Model | Dim | Paris | Oxford | Oxford 105K |
|---|---:|---:|---:|---:|
| ResNet-50 | 16 | 1.62 | 0.1751 | N/A |
| DenseNet161 | 16 | 1.95 | 0.1822 | N/A |
| VGG | 16 | 1.58 | 0.1231 | N/A |

**Table VI.** Due to some complications, born out of compute limitations I, was not able to compute the rest of the dimensions using LDA.

<a id="table-vii"></a>

**Resnet Retrieval Results (mAP)**

| Dataset | 16 | 32 | 64 | 128 | 256 | 512 |
|---|---:|---:|---:|---:|---:|---:|
| Paris | 2.08 | 2.56 | 2.90 | 2.99 | 3.26 | 3.04 |
| Oxford | 0.239 | 0.289 | 0.342 | 0.368 | 0.362 | 0.344 |

**Table VII.** Compressed neural features with PCA

<a id="table-viii"></a>

**DenseNet161 Retrieval Results (mAP)**

| Dataset | 16 | 32 | 64 | 128 | 256 | 512 |
|---|---:|---:|---:|---:|---:|---:|
| Paris | 2.10 | 2.57 | 3.26 | 3.05 | 3.29 | 3.31 |
| Oxford | 0.302 | 0.348 | 0.41 | 0.442 | 0.457 | 0.449 |

**Table VIII.** Compressed neural features with PCA

<a id="table-ix"></a>

**VGG16 Retrieval Results (mAP)**

| Dataset | 16 | 32 | 64 | 128 | 256 | 512 |
|---|---:|---:|---:|---:|---:|---:|
| Paris | 0.96 | 1.12 | 1.01 | 0.99 | 0.96 | 0.92 |
| Oxford | 0.102 | 0.108 | 0.106 | 0.104 | 0.102 | 0.100 |

**Table IX.** Compressed neural features with PCA

## IV. Future Work

While these preliminary results are good, this research is by no means exhaustive and for the most part, it was constrained by the amount of data my personal computer can process. It would be beneficial to experiment with a higher quality dataset since there were a number of issues with the crawled images. Our current dataset was very small and it contained large number of duplication. Around 35% of the images are duplicates which means that the intro class diversity is even smaller than initially tough. It would be interesting to see other compression techniques as well as computing different dimensions for LDA compressed neural codes and see if there is a significant difference between compression levels.

## V. Conclusion

This paper proves that not al neural codes are created equal. We can see that the modern models - resnet-50, DenseNet161 - outperform the time-proven VGG16 [IX](#table-ix) architecture on both classification tasks as well as in retrieval tasks. We can also get a glimpse of how successful are the convolution kernels at finding these relationships with the use of Convolutional Activation Maps (CAMs) [[15]](#ref-15); [Fig. 3](#fig-3).

Another interesting finding was the fact that even though the ResNet-50 model outperformed the DenseNet161 model at classification [IV](#table-iv), it significantly underperformed when it came to retrieval [VII](#table-vii). The neural features generated by the best performing classifier significantly underperformed when compared to a slightly less efficient classifier. This means that while there is a correlation between a classifier performance and the quality of its convolutional features, it is not a determining factor for determining how well it will transfer to retrieval tasks. I believe that this phenomenon is due to the DNN architecture. In a DNN the classification performance is a function of both the quality of the convolutional features, but also, the quality of you fully connected layers. I believe that ResNet-50 while producing lower quality features than DenseNet161, was able to make up for it by training its fully connected layer to make up for the difference; There for, outperforming DenseNet161 at the classification task.

## References

<a id="ref-1"></a>

1. Wiki. 2019. PyTorch. Retrieved: [https://en.wikipedia.org/wiki/PyTorch](https://en.wikipedia.org/wiki/PyTorch)

<a id="ref-2"></a>

2. Noh, Hyeonwoo, Andre Araujo, Jack Sim, Tobias Weyand, and Bohyung Han., Large-Scale Image Retrieval with Attentive Deep Local Features., IEEE International Conference on Computer Vision (ICCV). [doi:10.1109/iccv.2017.374](https://doi.org/10.1109/ICCV.2017.374).. Harlow, England: Addison-Wesley, 2017.

<a id="ref-3"></a>

3. Lowe, D.G. Distinctive Image Features from Scale-Invariant Keypoints. *International Journal of Computer Vision* 60, 91–110 (2004). [https://doi.org/10.1023/B:VISI.0000029664.99615.94](https://doi.org/10.1023/B:VISI.0000029664.99615.94)

<a id="ref-4"></a>

4. Bay H., Tuytelaars T., Van Gool L. (2006) SURF: Speeded Up Robust Features. In: Leonardis A., Bischof H., Pinz A. (eds) *Computer Vision – ECCV 2006*. ECCV 2006. Lecture Notes in Computer Science, vol 3951. Springer, Berlin, Heidelberg.

<a id="ref-5"></a>

5. Babenko A., Slesarev A., Chigorin A., Lempitsky V. (2014) Neural Codes for Image Retrieval. In: Fleet D., Pajdla T., Schiele B., Tuytelaars T. (eds) *Computer Vision – ECCV 2014*. ECCV 2014. Lecture Notes in Computer Science, vol 8689. Springer, Cham.

<a id="ref-6"></a>

6. H. Jgou, M. Douze and C. Schmid, "Product Quantization for Nearest Neighbor Search," in *IEEE Transactions on Pattern Analysis and Machine Intelligence*, vol. 33, no. 1, pp. 117-128, Jan. 2011.

<a id="ref-7"></a>

7. T. Ge, K. He, Q. Ke and J. Sun, "Optimized Product Quantization for Approximate Nearest Neighbor Search," 2013 IEEE Conference on Computer Vision and Pattern Recognition, Portland, OR, 2013, pp. 2946-2953.

<a id="ref-8"></a>

8. Lindsay I. Smith. *A Tutorial on Principal Component Analysis*. [http://www.cs.otago.ac.nz/cosc453/student_tutorials/principal_components.pdf](http://www.cs.otago.ac.nz/cosc453/student_tutorials/principal_components.pdf), February 26, 2002.

<a id="ref-9"></a>

9. Tobias Weyand, Andre Araujo, Bingyi Cao, Jack Sim, *Google Landmarks Dataset v2 – A Large-Scale Benchmark for Instance-Level Recognition and Retrieval*, 2020, arXiv

<a id="ref-10"></a>

10. J. Philbin, O. Chum, M. Isard, J. Sivic and A. Zisserman *Lost in Quantization: Improving Particular Object Retrieval in Large Scale Image Databases*; Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (2008

<a id="ref-11"></a>

11. J. Philbin, O. Chum, M. Isard, J. Sivic and A. Zisserman *Object retrieval with large vocabularies and fast spatial matching*; Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (2007)

<a id="ref-12"></a>

12. K. Simonyan and A. Zisserman. Very deep convolutional networks for large-scale image recognition. In ICLR, 2015.

<a id="ref-13"></a>

13. Huang, G., Liu, Z., Maaten, L., Weinberger, K.Q.: Densely connected convolutional networks. In: Proc. IEEE Conf. on computer vision and pattern recognition, Hawaii, USA, pp. 7786 (2017)

<a id="ref-14"></a>

14. K. He, X. Zhang, S. Ren, and J. Sun. Deep residual learning for image recognition. arXiv preprint [arXiv:1512.03385](https://arxiv.org/abs/1512.03385), 2015.

<a id="ref-15"></a>

15. B. Zhou, A. Khosla, L. A., A. Oliva, and A. Torralba. Learning Deep Features for Discriminative Localization. In CVPR, 2016.