import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../constants.dart';

class ServiceMenu extends StatelessWidget {
  const ServiceMenu({
    Key? key,
    required this.text,
    required this.prix,
    required this.heure,
    this.press,
  }) : super(key: key);

  final String text, prix, heure;
  final VoidCallback? press;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 25, vertical: 5),
      child: TextButton(
        style: TextButton.styleFrom(
          primary: Colors.grey[500],
          padding: EdgeInsets.all(20),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          backgroundColor: Color.fromARGB(155, 234, 235, 240),
        ),
        onPressed: press,
        child: Row(
          children: [
            const SizedBox(width: 10),
            Expanded(
                child: Text(
              text,
              style: TextStyle(color: Colors.black),
            )),
            Text(heure, style: TextStyle(color: Colors.black)),
            SizedBox(width: 15),
            Text(prix, style: TextStyle(color: Colors.black)),
            SizedBox(width: 40),
            const Icon(Icons.arrow_forward_ios, color: Colors.black),
          ],
        ),
      ),
    );
  }
}
