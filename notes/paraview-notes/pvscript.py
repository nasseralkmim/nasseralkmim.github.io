from paraview.simple import *
reader = OpenDataFile('test.case')

SaveData('point-data.csv', proxy=reader,
ChooseArraysToWrite=1,
    PointDataArrays=['displacement'])
