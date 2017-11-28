{
  "targets": [
    {
      "target_name": "spdlog",
      "sources": [
        "src/main.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}