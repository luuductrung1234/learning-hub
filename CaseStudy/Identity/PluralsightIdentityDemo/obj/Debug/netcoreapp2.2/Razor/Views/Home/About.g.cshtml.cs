#pragma checksum "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4399f4ac9dae5a6f7efc2122cea25980ab3dbfb1"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_About), @"mvc.1.0.view", @"/Views/Home/About.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Home/About.cshtml", typeof(AspNetCore.Views_Home_About))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\_ViewImports.cshtml"
using PluralsightIdentityDemo;

#line default
#line hidden
#line 2 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\_ViewImports.cshtml"
using PluralsightIdentityDemo.Models;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"4399f4ac9dae5a6f7efc2122cea25980ab3dbfb1", @"/Views/Home/About.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"8aebad8326b4208f60a8dce9bce02fc7144f871a", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_About : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 2 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml"
  
   ViewData["Title"] = "About";

#line default
#line hidden
            BeginContext(42, 32, true);
            WriteLiteral("\r\n<h2>Authenticated</h2>\r\n<ul>\r\n");
            EndContext();
#line 8 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml"
    foreach (var claim in User.Claims)
   {

#line default
#line hidden
            BeginContext(120, 18, true);
            WriteLiteral("      <li><strong>");
            EndContext();
            BeginContext(139, 10, false);
#line 10 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml"
             Write(claim.Type);

#line default
#line hidden
            EndContext();
            BeginContext(149, 11, true);
            WriteLiteral("</strong>: ");
            EndContext();
            BeginContext(161, 11, false);
#line 10 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml"
                                   Write(claim.Value);

#line default
#line hidden
            EndContext();
            BeginContext(172, 7, true);
            WriteLiteral("</li>\r\n");
            EndContext();
#line 11 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\Identity\PluralsightIdentityDemo\Views\Home\About.cshtml"
   }

#line default
#line hidden
            BeginContext(185, 9, true);
            WriteLiteral("</ul>\r\n\r\n");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
