import 'dart:typed_data';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../../salon.dart';

final dio = Dio();

class ProductImages extends StatefulWidget {
  const ProductImages({
    Key? key,
    required this.reference,
  }) : super(key: key);

  final int reference;

  @override
  _ProductImagesState createState() => _ProductImagesState();
}

class _ProductImagesState extends State<ProductImages> {
  int currentIndex = 0;
  List<dynamic> salonImages = [];

  @override
  void initState() {
    super.initState();
  }

  Future<List<salon>> getItems() async {
    try {
      final response = await dio.get(
          'http://192.168.1.39:5000/api/getByImageRef/${widget.reference}');
      final List<dynamic> data = response.data;
      final items = data
          .map((itemJson) => salon.fromJson(itemJson as Map<String, dynamic>))
          .toList();
      print(data);
      return items;
    } catch (e) {
      throw Exception('Failed to get items: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<salon>>(
      future: getItems(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        } else if (snapshot.hasError) {
          return Center(
            child: Text('Error: ${snapshot.error}'),
          );
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(
            child: Text('No data available.'),
          );
        } else {
          final images = snapshot.data!;
          return CarouselSlider.builder(
            itemCount: images.length,
            itemBuilder: (BuildContext context, int index, int realIndex) {
              return Container(
                child: MyImageWidget(imageBytes: images[index].src),
              );
            },
            options: CarouselOptions(
              enlargeCenterPage: true,
              aspectRatio: 2.5,
              enableInfiniteScroll: false,
              onPageChanged: (index, reason) {},
            ),
          );
        }
      },
    );
  }
}

class MyImageWidget extends StatelessWidget {
  final Uint8List imageBytes;

  MyImageWidget({required this.imageBytes});

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Image.memory(
      imageBytes,
      fit: BoxFit.cover,
      height: 193,
      width: screenWidth,
    );
  }
}
