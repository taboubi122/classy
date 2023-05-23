import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../../constants.dart';
import '../../../salon.dart';
import '../../../size_config.dart';

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
  int selectedImage = 0;
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
          return ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: images.length,
            itemBuilder: (context, index) =>
                MyImageWidget(imageBytes: images[0].src),
            separatorBuilder: (context, index) => const SizedBox(height: 10),
          );
        }
      },
    );
  }

  Widget Images(salon salon, int index) {
    return Column(
      children: [
        SizedBox(
          width: getProportionateScreenWidth(238),
          child: AspectRatio(
            aspectRatio: 1,
            child: Hero(
                tag: salon.reference.toString(),
                child: MyImageWidget(imageBytes: salon.src)),
          ),
        ),
        SizedBox(height: getProportionateScreenWidth(20)),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ...List.generate(
              salon.src.length,
              (index) => buildSmallProductPreview(salon, index),
            ),
          ],
        ),
      ],
    );
  }

  GestureDetector buildSmallProductPreview(salon item, int index) {
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedImage = index;
        });
      },
      child: AnimatedContainer(
        duration: defaultDuration,
        margin: EdgeInsets.only(right: 15),
        padding: EdgeInsets.all(8),
        height: getProportionateScreenWidth(48),
        width: getProportionateScreenWidth(48),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: kPrimaryColor.withOpacity(selectedImage == index ? 1 : 0),
          ),
        ),
        child: MyImageWidget(imageBytes: item.src),
      ),
    );
  }
}

class MyImageWidget extends StatelessWidget {
  final Uint8List imageBytes;

  MyImageWidget({required this.imageBytes});

  @override
  Widget build(BuildContext context) {
    return Image.memory(
      imageBytes,
      fit: BoxFit.cover,
      height: 193,
      width: 140,
    );
  }
}
