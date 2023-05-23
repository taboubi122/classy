import 'package:flutter/material.dart';

import 'components/body.dart';

class LoginFaildScreen extends StatelessWidget {
  static String routeName = "/login_faild";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: SizedBox(),
        title: const Text("Login Faild"),
      ),
      body: Body(),
    );
  }
}
