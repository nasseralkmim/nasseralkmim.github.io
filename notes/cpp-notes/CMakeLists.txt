cmake_minimum_required(VERSION 3.17)

project(myproject)

add_library(libmymath SHARED IMPORTED)
set_property(TARGET libmymath PROPERTY IMPORTED_LOCATION ../libmymath.so)

add_executable(myproject main.cpp)

target_link_libraries(myproject libmymath)
