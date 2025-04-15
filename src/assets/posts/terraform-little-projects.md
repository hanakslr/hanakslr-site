---
title: terraform is for personal projects too
subtitle: Feels like overkill until it isn't
publishedOn: 2025-04-15
coverImage:
  src: "https://images.unsplash.com/photo-1505871174817-a40a99407566?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt: "Moon phases"
  source: "Image by Marcus Dall Col"
---

When I built [Petaler](https://getpetaler.com), I did nearly all the infra config manually in the AWS console. Lambda function here, IAM permissions there, etc.

This past winter (years after spinning the whole platform down) I finally went through and managed to locate all of the remaining services that were costing me like 47 cents a month and manually took them down. If I needed to get it running again, I'm sure I could, but not without a lot of guessing.

### terraform destroy

Meanwhile a side project from a couple months ago I put on the back burner that had the works - GKE cluster, service accounts, DNS config, VPC... _poof_ with one command this morning.

```sh
terraform destroy

...

Plan: 0 to add, 0 to change, 33 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes
```

So that's nice - put it back up when I want to come back to it :) nice reminder.
