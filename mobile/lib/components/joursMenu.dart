import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/screens/reservation/reservation.dart';

class joursMenu extends StatefulWidget {
  const joursMenu({
    Key? key,
    required this.text,
  }) : super(key: key);

  final String text;

  @override
  _joursMenuState createState() => _joursMenuState();
}

final dio = Dio();

class _joursMenuState extends State<joursMenu> {
  bool isExpanded = false;

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
                    const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Colors.black,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
