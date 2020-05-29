from PIL import Image, ImageFilter
from matplotlib import pyplot as plt
import joblib
import pandas as pd
import numpy as np

np.random.seed(1212)

import keras
from keras.models import Model
from keras.layers import *
from keras import optimizers
# print("hello from python")
def imageprepare(argv):
    """
    This function returns the pixel values.
    The imput is a png file location.
    """
    im = Image.open(argv).convert('L')
    width = float(im.size[0])
    height = float(im.size[1])
    newImage = Image.new('L', (28, 28), (255))  # creates white canvas of 28x28 pixels

    if width > height:  # check which dimension is bigger
        # Width is bigger. Width becomes 20 pixels.
        nheight = int(round((20.0 / width * height), 0))  # resize height according to ratio width
        if (nheight == 0):  # rare case but minimum is 1 pixel
            nheight = 1
            # resize and sharpen
        img = im.resize((20, nheight), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)
        wtop = int(round(((28 - nheight) / 2), 0))  # calculate horizontal position
        newImage.paste(img, (4, wtop))  # paste resized image on white canvas
    else:
        # Height is bigger. Heigth becomes 20 pixels.
        nwidth = int(round((20.0 / height * width), 0))  # resize width according to ratio height
        if (nwidth == 0):  # rare case but minimum is 1 pixel
            nwidth = 1
            # resize and sharpen
        img = im.resize((nwidth, 20), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)
        wleft = int(round(((28 - nwidth) / 2), 0))  # caculate vertical pozition
        newImage.paste(img, (wleft, 4))  # paste resized image on white canvas

    # newImage.save("sample.png

    tv = list(newImage.getdata())  # get pixel values

    # normalize pixels to 0 and 1. 0 is pure white, 1 is pure black.
    tva = [(255 - x) * 1.0 / 255.0 for x in tv]
        # print(tva)
    return tva
x=[imageprepare('uploads/fromclient.png')]#file path here 
# print(len(x))# mnist IMAGES are 28x28=784 pixels  
# print(x[0])
#Now we convert 784 sized 1d array to 24x24 sized 2d array so that we can visualize it
newArr=[[0 for d in range(28)] for y in range(28)]
k = 0
for i in range(28):
    for j in range(28):
        newArr[i][j]=x[0][k]
        k=k+1

# for i in range(28):
#     for j in range(28):
#         print(newArr[i][j])
#         print(' , ')
#     print('\n')

# print(np.array(newArr));
x_test=np.array(newArr).reshape(1,784);
# for i in range(0,784):
#     print(x_test[0][i])
#     print(",")
model_from_joblib = joblib.load('digit_recog.pkl')  
y_pred = model_from_joblib.predict(x_test)
# print(y_pred.shape)
# print(y_pred)
final_result =  np.argmax(y_pred, axis=1)
#print("Predicted value:",final_result)
print(final_result[0])
plt.imshow(newArr, interpolation='nearest')
plt.savefig('uploads/MNIST_IMAGE.png')#save MNIST image
#plt.show()#Show / plot that image
