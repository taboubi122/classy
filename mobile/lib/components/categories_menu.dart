import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class CategorieMenu extends StatefulWidget {
  const CategorieMenu({
    Key? key,
    required this.text,
    required this.ref,
  }) : super(key: key);

  final String text;
  final int ref;

  @override
  _CategorieMenuState createState() => _CategorieMenuState();
}

final dio = Dio();

class _CategorieMenuState extends State<CategorieMenu> {
  bool isExpanded = false;
  Future<List<dynamic>> getItem() async {
    try {
      final response = await dio
          .get('http://192.168.1.39:5000/api/servicesNomCentre/${widget.ref}');
      final dynamic data = response.data;
      print(data);
      if (data != null) {
        return data as List<dynamic>;
      } else {
        throw Exception('No data available.');
      }
    } catch (e) {
      throw Exception('Failed to get item: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 1, vertical: 10),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 5,
              offset: Offset(0, 2), // décalage de l'ombre
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              color: Colors.white, // Arrière-plan noir
              child: TextButton(
                style: TextButton.styleFrom(
                  padding: EdgeInsets.all(10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0),
                  ),
                  backgroundColor: Colors.white,
                ),
                onPressed: () {
                  setState(() {
                    isExpanded = !isExpanded;
                  });
                },
                child: Row(
                  children: [
                    const SizedBox(width: 20),
                    Expanded(
                      child: Text(
                        widget.text,
                        style: TextStyle(color: Colors.black),
                      ),
                    ),
                    SizedBox(width: 60),
                    Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Colors.black,
                    ),
                  ],
                ),
              ),
            ),
            if (isExpanded)
              Container(
                color: Colors.white, // Arrière-plan noir
                padding: EdgeInsets.symmetric(
                  horizontal: 127,
                ),
                child: Text(
                  'Contenu du paragraphe',
                  style: TextStyle(color: Colors.black),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
